#!/usr/bin/env node
// secret-guard — PreToolUse Bash hook.
// Denies command patterns that would print secrets (API keys, tokens, passwords)
// to the screen. Anything printed lands in the session transcript, so the safest
// move is to never echo a secret at all.
// Output schema per https://docs.claude.com/en/docs/claude-code/hooks
//   { hookSpecificOutput: { hookEventName, permissionDecision: "allow"|"deny", permissionDecisionReason } }
// Fail-open on parse errors: a buggy hook must not block legitimate work.

const fs = require('fs');
const path = require('path');
const os = require('os');

const LOG_DIR = path.join(os.homedir(), '.local', 'state', 'secret-guard');
const LOG_FILE = path.join(LOG_DIR, 'decisions.log');

function normalize(cmd) {
  // 1) Collapse line continuations
  let s = cmd.replace(/\\\r?\n/g, ' ');
  // 2) Collapse runs of whitespace
  s = s.replace(/[ \t]+/g, ' ');
  // 3) Strip surrounding single/double quotes from "word"-shaped tokens
  s = s.replace(/(^|\s)"([^"\s]+)"(?=\s|$|[|&;])/g, '$1$2');
  s = s.replace(/(^|\s)'([^'\s]+)'(?=\s|$|[|&;])/g, '$1$2');
  // 4) Strip quotes appearing inside paths e.g. cat ~/.aws/"credentials"
  s = s.replace(/(["'])([A-Za-z0-9._-]+)\1/g, '$2');
  return s.trim();
}

// Known non-secret env-var names (false-positive suppression).
// These contain AUTH/KEY/PASS/etc. but are not secrets — system/desktop/SSH/HTTP-meta vars.
const SAFE_ENV_VARS = new RegExp(String.raw`^(SSH_AUTH_SOCK|SSH_AGENT_PID|KEYBOARD_LAYOUT|GTK_KEY_THEME|GTK_IM_MODULE|GPG_AGENT_INFO|XAUTHORITY|XDG_[A-Z_]*|GNUPGHOME|PASSENGER_APP_ENV|RAILS_ENV|RACK_ENV|NODE_ENV|FLASK_ENV|DJANGO_SETTINGS_MODULE|DESKTOP_SESSION|GDMSESSION|SHELL|TERM|PATH|HOME|USER|LANG|LC_[A-Z]+|HOSTNAME|EDITOR|VISUAL|PAGER|DISPLAY|WAYLAND_DISPLAY|MAIL|TMPDIR|PWD|OLDPWD|SHLVL|LINES|COLUMNS|TZ|HISTFILE|HISTSIZE|HISTCONTROL|HISTIGNORE|BASH_VERSION|ZSH_VERSION|HOST_KEY|HOST_KEYS|API_KEY_FORMAT|API_KEY_HEADER)$`, 'i');

// Allow-list — overrides deny patterns. Order: most-specific first.
const ALLOW = [
  /(^|\s|;|&)secret-tool\s+(store|clear)\b/,
  /(^|\s)go\s+env\b/,
  /(^|\s)npm\s+config\s+get\s+\S/,
  /(^|\s)python\s+-m\s+sysconfig\b/,
  /(^|\s)rake\s+about\b/,
  /(^|\s)SECRET_GUARD_BYPASS=1\s/,
];

const SECRET_NAME = String.raw`\w*(?:TOKEN|KEY|SECRET|PASSWORD|API_KEY|PASS|CREDENTIAL|AUTH)\w*`;

// Deny patterns. Each entry: { re, msg }
const DENY = [
  {
    re: new RegExp(String.raw`\bsecret-tool\b(\s+[-A-Za-z0-9_=]+)*\s+(search|lookup)\b`, 'i'),
    msg: '`secret-tool search`/`lookup` prints the secret value to the screen, which gets captured in the session transcript. Set the secret as an environment variable outside this chat and pass it straight to the command that needs it.',
  },
  {
    re: /(^|\s|;|&|\|)(printenv|env)(\s*$|\s*[|&;])/m,
    msg: 'Bare `printenv` / `env` dumps every environment variable, including any secret-valued ones. To inspect a specific non-secret var, use `printenv VAR_NAME` for a single var (still denied if the name matches a secret pattern).',
  },
  {
    re: new RegExp(String.raw`(^|\s|;|&|\|)(printenv|env)\s+${SECRET_NAME}`, 'mi'),
    msg: '`printenv <SECRET_VAR>` prints the secret value. Don\'t echo secrets — pass the variable directly to the command that needs it (e.g. `curl -H "Authorization: Bearer $MY_TOKEN" ...`).',
  },
  {
    re: new RegExp(String.raw`(^|\s|;|&|\|)(echo|printf)\b[^|;&]*?\$\{?${SECRET_NAME}\}?`, 'mi'),
    msg: 'Printing a secret-shaped variable (echo/printf) puts its value in the transcript. Pass the variable directly to the consuming command instead of printing it.',
  },
  {
    re: new RegExp(String.raw`(^|\s|;|&|\|)declare\s+-p\s+${SECRET_NAME}\b`, 'mi'),
    msg: '`declare -p <SECRET_VAR>` prints the variable\'s value. Don\'t echo secrets — pass them directly to the command that needs them.',
  },
  {
    re: /(^|\s|;|&|\|)(cat|less|more|head|tail|bat|sed\s+-n|rg|ripgrep|fgrep|egrep|grep|awk|cut|column|jq|yq|view)\s+[^|;&]*?(\.env(\.[A-Za-z0-9_-]+)?|\.aws\/credentials|\.netrc|\.config\/gh\/(hosts|config)\.yml|\.slack-webhook|\.claude\.json|\.credentials\.json|\.encryption-key|\/secrets?\.[a-z]+|id_(rsa|ed25519|ecdsa))(\s|$|[|;&])/m,
    msg: 'Reading a credential file dumps its contents to the screen (and into the transcript). Keep secrets in a password manager or environment variable, and pass them straight to the command that needs them instead of displaying them.',
  },
  {
    re: /(^|\s|;|&|\|)(curl|wget|http|httpie)\s+[^|]*-H\s+["']?Authorization:\s*(Bearer|Basic|Token)\s+(?!\$|\$\{)[A-Za-z0-9_\-.+/=]{20,}/m,
    msg: 'Literal token in command-line args is visible to other programs on the machine and lands in the transcript verbatim. Put the token in an environment variable and reference it as `$MY_TOKEN` instead: `curl -H "Authorization: Bearer $MY_TOKEN" ...`.',
  },
  {
    re: /(^|\s|;|&|\|)(echo|printf)\s+["']?[A-Za-z0-9_\-+/=]{30,}["']?\s*\|/m,
    msg: 'Piping a literal high-entropy string suggests a hardcoded token. Put the value in an environment variable and reference it by name so it never appears in the command.',
  },
];

// Only the precise example-file names are exempt. A broad "path mentions docs/"
// exemption would let `cat docs/../.env` walk around every deny rule.
const EXAMPLE_FILE = /\.env\.(example|sample|template|dist|tpl)\b/i;

let buf = '';
const t = setTimeout(() => process.exit(0), 4500);
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => buf += c);
process.stdin.on('end', () => {
  clearTimeout(t);
  try {
    const data = JSON.parse(buf);
    if (data.tool_name !== 'Bash') return process.exit(0);
    const raw = data.tool_input?.command || '';
    if (!raw) return process.exit(0);

    const cmd = normalize(raw);

    // SECRET_GUARD_BYPASS escape hatch — log and allow.
    if (/(^|\s)SECRET_GUARD_BYPASS=1\s/.test(cmd)) {
      logDecision('bypass', 'SECRET_GUARD_BYPASS=1', raw, data);
      return process.exit(0); // implicit allow
    }

    // Example-file exclusion — .env.example and friends are meant to be read.
    if (EXAMPLE_FILE.test(cmd)) {
      return process.exit(0);
    }

    // Allow-list pass — explicit allow overrides any deny.
    for (const a of ALLOW) {
      if (a.test(cmd)) return process.exit(0);
    }

    // Safe-env-var allow: if the command is `echo $VAR` (or printf) and VAR is in the
    // known safe list (SSH_AUTH_SOCK, XDG_*, NODE_ENV, etc.), allow.
    const echoVarMatch = cmd.match(/(?:^|\s|;|&|\|)(?:echo|printf)\s+(?:%[a-z]\s+)?["']?\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?["']?/i);
    if (echoVarMatch && SAFE_ENV_VARS.test(echoVarMatch[1])) {
      return process.exit(0);
    }
    const printenvVarMatch = cmd.match(/(?:^|\s|;|&|\|)printenv\s+([A-Za-z_][A-Za-z0-9_]*)/);
    if (printenvVarMatch && SAFE_ENV_VARS.test(printenvVarMatch[1])) {
      return process.exit(0);
    }

    // Deny scan.
    for (const d of DENY) {
      if (d.re.test(cmd)) {
        logDecision('deny', d.re.source.slice(0, 60), raw, data);
        const out = {
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason:
              `secret-guard: ${d.msg}\n\n` +
              `If you have a legitimate need to bypass this for one command, prefix with ` +
              `\`SECRET_GUARD_BYPASS=1\` — the bypass is logged for audit at ` +
              `~/.local/state/secret-guard/decisions.log. Never bypass to read/echo a token; ` +
              `bypass is for operational tasks the regex over-matches.`,
          },
        };
        process.stdout.write(JSON.stringify(out));
        return;
      }
    }
  } catch {
    // fail-open
  }
});

function logDecision(verdict, pattern, originalCmd, data) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true, mode: 0o700 });
    fs.chmodSync(LOG_DIR, 0o700);
    // Log: time, verdict, pattern (truncated), tool_use_id, cwd basename, cmd summary (first 80 chars, with known token shapes scrubbed)
    const cmdSummary = scrub(originalCmd).slice(0, 80).replace(/\s+/g, ' ');
    const line = [
      new Date().toISOString(),
      verdict,
      pattern,
      data.tool_use_id || '',
      path.basename(data.cwd || ''),
      cmdSummary,
    ].join('\t') + '\n';
    fs.appendFileSync(LOG_FILE, line, { mode: 0o600 });
    fs.chmodSync(LOG_FILE, 0o600);
  } catch {
    // logging is best-effort
  }
}

// Scrub token shapes from any string before logging. Known prefixes first,
// then a catch-all for Authorization headers and any long high-entropy word —
// over-redacting this best-effort audit log is fine; leaking into it is not.
function scrub(s) {
  return s
    .replace(/\bntn_[A-Za-z0-9_]{10,}/g, 'ntn_[REDACTED]')
    .replace(/\bsk-ant-[A-Za-z0-9_-]{10,}/g, 'sk-ant-[REDACTED]')
    .replace(/\bsk-[A-Za-z0-9_-]{10,}/g, 'sk-[REDACTED]')
    .replace(/\bgh[ousrp]_[A-Za-z0-9]{10,}/g, 'gh_[REDACTED]')
    .replace(/\bxox[baprso]-[A-Za-z0-9-]{10,}/g, 'xox_[REDACTED]')
    .replace(/\b(AKIA|ASIA)[0-9A-Z]{16}\b/g, 'AKIA[REDACTED]')
    .replace(/\bAIza[0-9A-Za-z_-]{20,}/g, 'AIza[REDACTED]')
    .replace(/(Authorization:\s*(?:Bearer|Basic|Token)\s+)[^\s"']+/gi, '$1[REDACTED]')
    .replace(/\b[A-Za-z0-9_\-+/=]{30,}\b/g, '[REDACTED-LONG-TOKEN]');
}
