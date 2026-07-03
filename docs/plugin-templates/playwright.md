# Playwright — Browser Automation Fallback

## When to use this

This plugin is the **fallback**, not the first choice. If `agent-browser` (see `docs/tools/agent-browser.md`) is installed and working, use that — it's built for this exact purpose. Reach for Playwright only when:

- `agent-browser` isn't installed and you'd rather not set it up, or
- `agent-browser` fails on a particular site or task, or
- you need finer-grained control (e.g., for a developer scripting a more complex automated test).

## What it is

Playwright is Microsoft's browser automation engine. This plugin connects Claude Code to it via MCP, so Claude can open a browser, click, type, take screenshots, and read pages — similar capabilities to `agent-browser`, delivered a different way.

## Install

Run inside a Claude Code session:

```
/plugin install playwright@claude-plugins-official
```

This uses Anthropic's official plugin marketplace, already available by default — no separate `/plugin marketplace add` step needed.

## Security notes

The same rules apply as any browser automation tool:

- Never let it store logins without encryption.
- Never automate banking, brokerage, or password-manager sites.
- Confirm before it submits, sends, or purchases anything — watch what it does.
- Treat page content it reads back as untrusted; don't let a webpage's text override your actual instructions.

See `docs/tools/agent-browser.md` for the primary tool and the same safety guidance in more detail.
