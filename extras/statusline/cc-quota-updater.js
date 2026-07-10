#!/usr/bin/env node
// PostToolUse hook: refresh /tmp/cc-quota-cache.json with per-model 5h usage.
// Fire-and-forget; never blocks Claude Code. 30s in-script rate-limit.
//
// Reads:
//   - `ccusage blocks --active --json` (block startTime; identifies the 5h window)
//   - ~/.claude/projects/*/*.jsonl (per-message {timestamp, model, usage.*})
//
// Writes atomically:
//   /tmp/cc-quota-cache.json  -> {opus_pct, sonnet_pct, fable_pct, opus_tok, sonnet_tok, fable_tok, updated_at}
//
// Env-var overrides (defaults are ballpark for heavy Max-plan usage — tune
// by watching /usage and setting these so the statusline % matches):
//   CC_OPUS_5H_LIMIT     default 200_000_000
//   CC_SONNET_5H_LIMIT   default 800_000_000
//   CC_FABLE_5H_LIMIT    default 200_000_000

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');

const CACHE_PATH = '/tmp/cc-quota-cache.json';
const RATE_LIMIT_MS = 30_000;

const OPUS_LIMIT   = parseInt(process.env.CC_OPUS_5H_LIMIT   || '200000000', 10);
const SONNET_LIMIT = parseInt(process.env.CC_SONNET_5H_LIMIT || '800000000', 10);
const FABLE_LIMIT  = parseInt(process.env.CC_FABLE_5H_LIMIT  || '200000000', 10);

function rateLimited() {
  try {
    const stat = fs.statSync(CACHE_PATH);
    return (Date.now() - stat.mtimeMs) < RATE_LIMIT_MS;
  } catch { return false; }
}

function activeBlockStart() {
  try {
    // Requires ccusage installed (`npm install -g ccusage`) — deliberately NOT
    // `npx -y ccusage@latest`, which would execute unpinned remote code from a hook.
    const out = execSync('ccusage blocks --active --json', {
      timeout: 8000, stdio: ['ignore', 'pipe', 'ignore'],
    }).toString();
    const j = JSON.parse(out);
    const block = (j.blocks || []).find(b => b.isActive);
    if (!block) return null;
    return new Date(block.startTime).getTime();
  } catch { return null; }
}

function sumPerModel(startMs) {
  const projectsDir = path.join(os.homedir(), '.claude', 'projects');
  let opusTok = 0, sonnetTok = 0, fableTok = 0;

  let projects;
  try { projects = fs.readdirSync(projectsDir); }
  catch { return { opusTok, sonnetTok, fableTok }; }

  for (const proj of projects) {
    const projPath = path.join(projectsDir, proj);
    let files;
    try { files = fs.readdirSync(projPath); }
    catch { continue; }
    for (const f of files) {
      if (!f.endsWith('.jsonl')) continue;
      const fp = path.join(projPath, f);
      try {
        const stat = fs.statSync(fp);
        if (stat.mtimeMs < startMs) continue;
      } catch { continue; }

      let content;
      try { content = fs.readFileSync(fp, 'utf8'); }
      catch { continue; }

      for (const line of content.split('\n')) {
        if (!line) continue;
        if (!line.includes('"model"') || !line.includes('"usage"')) continue;
        let obj;
        try { obj = JSON.parse(line); } catch { continue; }
        const ts = obj.timestamp ? Date.parse(obj.timestamp) : NaN;
        if (!isFinite(ts) || ts < startMs) continue;
        const m = obj.message || {};
        const model = m.model || '';
        const u = m.usage || {};
        const tok =
          (u.input_tokens                || 0) +
          (u.output_tokens               || 0) +
          (u.cache_creation_input_tokens || 0) +
          (u.cache_read_input_tokens     || 0);
        if (model.includes('opus'))   opusTok   += tok;
        if (model.includes('sonnet')) sonnetTok += tok;
        if (model.includes('fable'))  fableTok  += tok;
      }
    }
  }
  return { opusTok, sonnetTok, fableTok };
}

function writeAtomic(payload) {
  const tmp = CACHE_PATH + '.tmp.' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(payload));
  fs.renameSync(tmp, CACHE_PATH);
}

function main() {
  if (rateLimited()) return;

  // Touch cache first so concurrent invocations rate-limit even before we finish.
  try { fs.utimesSync(CACHE_PATH, new Date(), new Date()); } catch {}

  const startMs = activeBlockStart();
  if (!startMs) return;

  const { opusTok, sonnetTok, fableTok } = sumPerModel(startMs);
  const payload = {
    opus_pct:   Math.round((opusTok   / OPUS_LIMIT)   * 100),
    sonnet_pct: Math.round((sonnetTok / SONNET_LIMIT) * 100),
    fable_pct:  Math.round((fableTok  / FABLE_LIMIT)  * 100),
    opus_tok:   opusTok,
    sonnet_tok: sonnetTok,
    fable_tok:  fableTok,
    opus_limit: OPUS_LIMIT,
    sonnet_limit: SONNET_LIMIT,
    fable_limit: FABLE_LIMIT,
    block_start: startMs,
    updated_at: Math.floor(Date.now() / 1000),
  };
  try { writeAtomic(payload); } catch {}
}

// Detach so the parent PostToolUse never waits on us.
if (process.argv[2] !== '--child') {
  const child = spawn(process.execPath, [__filename, '--child'], {
    detached: true, stdio: 'ignore',
  });
  child.unref();
  process.exit(0);
}

try { main(); } catch {}
