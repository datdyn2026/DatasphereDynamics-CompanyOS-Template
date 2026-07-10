#!/usr/bin/env node
// secret-detector — PostToolUse Bash hook.
// Scans tool_response for token-shaped patterns. Cannot redact (the model already
// saw the output by the time this fires) — flags the incident for rotation.
// Critical logging discipline: never write the matched value to disk.
// Output: top-level { decision: "block", reason: "..." }

const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_DIR = path.join(os.homedir(), '.local', 'state', 'secret-detector');
const LOG_FILE = path.join(STATE_DIR, 'incidents.log');
const FLAG_FILE = path.join(STATE_DIR, 'ROTATE-NOW');

// Patterns by confidence tier. Each entry: { service, re, conf }
const PATTERNS = [
  // HIGH-confidence (low false-positive rate)
  { service: 'notion',         re: /\bntn_[A-Za-z0-9_]{30,}/g,                       conf: 'HIGH' },
  { service: 'anthropic',      re: /\bsk-ant-(?:api03-)?[A-Za-z0-9_-]{30,}/g,        conf: 'HIGH' },
  { service: 'github-pat',     re: /\bghp_[A-Za-z0-9]{30,}/g,                        conf: 'HIGH' },
  { service: 'github-oauth',   re: /\bgho_[A-Za-z0-9]{30,}/g,                        conf: 'HIGH' },
  { service: 'github-user',    re: /\bghu_[A-Za-z0-9]{30,}/g,                        conf: 'HIGH' },
  { service: 'github-server',  re: /\bghs_[A-Za-z0-9]{30,}/g,                        conf: 'HIGH' },
  { service: 'github-refresh', re: /\bghr_[A-Za-z0-9]{30,}/g,                        conf: 'HIGH' },
  { service: 'slack-bot',      re: /\bxoxb-[A-Za-z0-9-]{30,}/g,                      conf: 'HIGH' },
  { service: 'slack-user',     re: /\bxoxp-[A-Za-z0-9-]{30,}/g,                      conf: 'HIGH' },
  { service: 'slack-app',      re: /\bxoxa-[A-Za-z0-9-]{30,}/g,                      conf: 'HIGH' },
  { service: 'slack-refresh',  re: /\bxoxe-[A-Za-z0-9-]{30,}/g,                      conf: 'HIGH' },
  { service: 'slack-webhook',  re: /\bhttps:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]{20,}/g, conf: 'HIGH' },
  { service: 'aws-access',     re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,                 conf: 'HIGH' },
  { service: 'aws-secret',     re: /aws_secret_access_key\s*[:=]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/gi, conf: 'HIGH' },
  { service: 'gcp-api',        re: /\bAIza[0-9A-Za-z_-]{35}\b/g,                     conf: 'HIGH' },
  { service: 'stripe-live',    re: /\b(sk|rk)_live_[A-Za-z0-9]{20,}/g,               conf: 'HIGH' },
  { service: 'pem-private',    re: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |ENCRYPTED |PGP |)PRIVATE KEY( BLOCK)?-----/g, conf: 'HIGH' },
  // MEDIUM-confidence — OpenAI sk- pattern overlaps with non-secret slugs
  { service: 'openai-or-sk',   re: /\bsk-(?:proj-)?[A-Za-z0-9]{32,}/g,               conf: 'MEDIUM' },
  // LOW-confidence — JWT pattern very noisy
  { service: 'jwt',            re: /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, conf: 'LOW' },
];

let buf = '';
const t = setTimeout(() => process.exit(0), 4500);
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => buf += c);
process.stdin.on('end', () => {
  clearTimeout(t);
  try {
    const data = JSON.parse(buf);
    if (data.tool_name !== 'Bash') return process.exit(0);
    const resp = data.tool_response || {};
    // Possible shapes: { stdout, stderr, output } or a plain string
    const parts = [];
    if (typeof resp === 'string') parts.push(resp);
    if (resp.stdout) parts.push(String(resp.stdout));
    if (resp.stderr) parts.push(String(resp.stderr));
    if (resp.output) parts.push(String(resp.output));
    if (resp.content) parts.push(String(resp.content));
    const body = parts.join('\n');
    if (!body) return process.exit(0);

    // Skip obvious documentation contexts to suppress JWT/sk- noise.
    const cmd = String(data.tool_input?.command || '');
    const docContext = /(docs?\/|\.md\b|README|CHANGELOG|man\s+\w|--help|\bjwt\.io\b|jwks?\.json)/i.test(cmd);

    const findings = [];
    const seenSig = new Set();
    for (const p of PATTERNS) {
      // For LOW-confidence patterns in doc contexts: skip entirely.
      if (p.conf === 'LOW' && docContext) continue;
      const re = new RegExp(p.re.source, p.re.flags);
      let m;
      while ((m = re.exec(body)) !== null) {
        // Signature: pattern source + position. Avoid duplicate reports of same hit.
        const sig = p.service + ':' + m.index;
        if (seenSig.has(sig)) continue;
        seenSig.add(sig);
        findings.push({ service: p.service, conf: p.conf });
        if (findings.length > 10) break;
      }
      if (findings.length > 10) break;
    }

    if (findings.length === 0) return process.exit(0);

    // Aggregate by service.
    const services = {};
    for (const f of findings) {
      if (!services[f.service]) services[f.service] = { count: 0, conf: f.conf };
      services[f.service].count += 1;
      // Promote confidence to the highest seen.
      if (rank(f.conf) > rank(services[f.service].conf)) services[f.service].conf = f.conf;
    }
    const serviceList = Object.entries(services);

    // Decide whether to fire ROTATE-NOW. HIGH/MEDIUM yes; LOW no.
    const rotate = serviceList.some(([, v]) => v.conf === 'HIGH' || v.conf === 'MEDIUM');

    logIncidents(serviceList, data, cmd);

    if (rotate) {
      writeRotateFlag(serviceList.filter(([, v]) => v.conf !== 'LOW').map(([s]) => s));
    }

    const lines = serviceList.map(([s, v]) => `  - ${s} (${v.conf}, ${v.count} hit${v.count > 1 ? 's' : ''})`).join('\n');
    const reason =
      `secret-detector: token pattern(s) detected in tool output:\n${lines}\n\n` +
      (rotate
        ? `ROTATE the listed HIGH/MEDIUM-confidence secrets within 24h. The value(s) ` +
          `are now in this session's transcript and Anthropic's API request logs. Local ` +
          `cleanup cannot reach the API log. Check ~/.local/state/secret-detector/ROTATE-NOW ` +
          `for the pending-rotation list. After rotation, run \`rm ~/.local/state/secret-detector/ROTATE-NOW\`.`
        : `LOW-confidence detection only (likely a JWT in API response or similar). ` +
          `Reviewed advisory. No rotation forced.`);

    process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  } catch {
    // fail-open
  }
});

function rank(c) { return c === 'HIGH' ? 3 : c === 'MEDIUM' ? 2 : 1; }

function logIncidents(serviceList, data, cmd) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
    fs.chmodSync(STATE_DIR, 0o700);
    // Locator: service name + tool_use_id + cwd basename + scrubbed-command-summary.
    // NEVER write the matched value to disk.
    const cmdSummary = scrub(cmd).slice(0, 80).replace(/\s+/g, ' ');
    for (const [service, v] of serviceList) {
      const line = [
        new Date().toISOString(),
        service,
        v.conf,
        String(v.count),
        data.tool_use_id || '',
        path.basename(data.cwd || ''),
        cmdSummary,
      ].join('\t') + '\n';
      fs.appendFileSync(LOG_FILE, line, { mode: 0o600 });
    }
    fs.chmodSync(LOG_FILE, 0o600);
  } catch {
    // best-effort
  }
}

function writeRotateFlag(services) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 });
    // Read existing list (if any), union with new services, write back.
    let existing = [];
    try { existing = fs.readFileSync(FLAG_FILE, 'utf8').split('\n').filter(Boolean); } catch {}
    const union = [...new Set([...existing, ...services])].sort();
    fs.writeFileSync(FLAG_FILE, union.join('\n') + '\n', { mode: 0o600 });
    fs.chmodSync(FLAG_FILE, 0o600);
  } catch {
    // best-effort
  }
}

// Scrub known token shapes from any string before logging. The log MUST NOT contain
// the secret. Patterns mirror those above but more permissive on length so partial
// matches still get scrubbed.
function scrub(s) {
  return s
    .replace(/\bntn_[A-Za-z0-9_]{10,}/g, 'ntn_[REDACTED]')
    .replace(/\bsk-ant-[A-Za-z0-9_-]{10,}/g, 'sk-ant-[REDACTED]')
    .replace(/\bsk-(?:proj-)?[A-Za-z0-9_-]{10,}/g, 'sk-[REDACTED]')
    .replace(/\bgh[ousrp]_[A-Za-z0-9]{10,}/g, 'gh_[REDACTED]')
    .replace(/\bxox[baprsoe]-[A-Za-z0-9-]{10,}/g, 'xox_[REDACTED]')
    .replace(/\b(AKIA|ASIA)[0-9A-Z]{16}\b/g, 'AKIA[REDACTED]')
    .replace(/\bAIza[0-9A-Za-z_-]{20,}/g, 'AIza[REDACTED]')
    .replace(/\b(sk|rk)_live_[A-Za-z0-9]{10,}/g, 'sk_live_[REDACTED]')
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, 'eyJ.[REDACTED].[REDACTED]')
    .replace(/\bhttps:\/\/hooks\.slack\.com\/services\/[^\s'"]+/g, 'https://hooks.slack.com/services/[REDACTED]');
}
