# Optional add-ons

Your Company OS works fully without anything on this page. These are optional
extras — each one solves a specific need. The `/onboard` wizard offers the most
useful ones at the end of setup, and every one of them can be added or removed
later by following the recipes below (just ask Claude to "add the session
changelog add-on" and point it here).

Add-ons come in three flavors:

- **Instant add-ons** — files already in this repo's `extras/` folder. Adding
  one is a single copy; it works immediately.
- **Power-ups** — plugins or apps that need a one-time install and a restart.
- **Built-in guards** — safety rails that are already on for everyone.

## Instant add-ons

### Session changelog

*What it adds:* a short, dated log in `workspace/logs/` of what Claude did each
work session — what changed, what was decided, how to undo it. Say "log this
session" at the end of a session to file one.

*Add it now:*
```
cp extras/agents/session-changelog.md .claude/agents/
```
Then add this row to the Skills table in `CLAUDE.md` so Claude knows it's active:
`| agent: session-changelog | Logs what each session changed |`

*Remove it:* delete `.claude/agents/session-changelog.md` and the table row.

### Setup-docs writer (session-kb)

*What it adds:* reproducible "how we set this up" articles in `workspace/kb/`,
so anything you configure once can be rebuilt from scratch later. Say
"document this setup" after setting something up.

*Add it now:*
```
cp extras/agents/session-kb.md .claude/agents/
```
Then add to the `CLAUDE.md` Skills table:
`| agent: session-kb | Writes reproducible setup docs |`

*Remove it:* delete `.claude/agents/session-kb.md` and the table row.

### Skill finder

*What it adds:* when you ask "can Claude do X?", this skill searches the open
skills ecosystem (skills.sh) for an installable skill that does X, checks that
it's reputable, and offers to install it.

*Add it now:*
```
cp -r extras/skills/find-skills .claude/skills/
```
Then add to the `CLAUDE.md` Skills table:
`| /find-skills | Finds and installs new skills |`

*Remove it:* delete the `.claude/skills/find-skills/` folder and the table row.

### Concise style

*What it adds:* shorter answers — Claude leads with the result, skips preamble
and recaps, and uses bullets over paragraphs.

*Add it now:*
```
mkdir -p .claude/output-styles && cp extras/output-styles/concise.md .claude/output-styles/
```
Then type `/output-style concise` in a session. (No `CLAUDE.md` row needed —
styles aren't skills.)

*Remove it:* type `/output-style default`, then delete the copied file.

## Power-ups

Each of these needs a one-time install, run inside a Claude Code session, and
then a restart (`exit`, then `claude`). None can be finished mid-wizard — the
wizard hands you the exact commands instead.

### Session memory (claude-mem)

Claude remembers context across sessions, so you stop re-explaining last week.
Full page: [`docs/plugin-templates/claude-mem.md`](plugin-templates/claude-mem.md)

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
```

### Browser control (Claude in Chrome)

Claude drives your real Chrome browser in a window you can watch — checking
portals, filling forms, verifying pages. Needs the desktop app, the official
"Claude" Chrome extension, and `claude --chrome`. **Read the safety rules
first** — it shares your logged-in browser.
Full page: [`docs/tools/claude-in-chrome.md`](tools/claude-in-chrome.md)

### Developer toolkit (superpowers)

A rigorous software-engineering methodology (planning, test-first coding,
structured debugging). Only useful if your team also builds software.
Full page: [`docs/plugin-templates/superpowers.md`](plugin-templates/superpowers.md)

```
/plugin install superpowers@claude-plugins-official
```

### Skill creator (skill-creator)

Tools for building and testing your own custom skills. Overlaps with the
built-in `/skill-builder`; get this if you want deeper skill testing.
Full page: [`docs/plugin-templates/skill-creator.md`](plugin-templates/skill-creator.md)

```
/plugin install skill-creator@claude-plugins-official
```

## Advanced (for technical users)

### Status line with usage tracking

A live terminal status line: git branch, model, context usage, session quota.
Files live in `extras/statusline/`. Desktop/CLI only (not claude.ai/code web);
needs `bash`, `jq`, and `curl`.

*Add it:* copy `extras/statusline/statusline.sh` to `.claude/hooks/`, then add
to `.claude/settings.json`:
```json
"statusLine": { "type": "command", "command": "bash .claude/hooks/statusline.sh" }
```
The optional `cc-quota-updater.js` companion adds per-model quota tracking but
requires the `ccusage` CLI — see the comments at the top of that file.

## Already built in

These need no install — recent Claude Code versions include them:

- **Deep research** — ask for a "deep research report on X" and Claude runs a
  multi-source, fact-checked research pass with citations.

## Built-in guards (on by default)

The template ships four safety hooks, wired in `.claude/settings.json`. They
are silent until something risky happens:

- **safety-guard** — blocks destructive terminal commands (mass deletes,
  force-pushes) before they run.
- **secret-guard** — blocks commands that would print passwords or API keys
  into the chat transcript, and says what to do instead.
- **secret-detector** — if a key or token does show up in command output, warns
  you and tells you to rotate (replace) it. Its incident log lives at
  `~/.local/state/secret-detector/`.
- **injection-scanner** — when Claude reads a file, warns if the file contains
  text that tries to give Claude hidden instructions (prompt injection).

*Turning one off* (not recommended): open `.claude/settings.json` and delete
the block that mentions that hook's `.sh` file, then restart. Each guard is a
separate block, so removing one leaves the others running.
