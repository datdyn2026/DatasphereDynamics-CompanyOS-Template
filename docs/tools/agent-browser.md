# Browser Automation: agent-browser

`agent-browser` is a command-line tool that lets Claude drive a real browser — open pages, read what's on them, click, fill in forms, and close the tab — without a person clicking through it manually. It's a third-party open-source project (not built by Anthropic); check its GitHub repo for the current maintainer and latest install instructions before relying on it for anything important.

## When you'd want it

- Filling out repetitive forms on a website that has no API.
- Checking a status page or portal that only shows information in a browser (no login required, or a throwaway/test login).
- Pulling structured information off a page for a report.

If a login is involved, read the security note below first.

## Install

```bash
npm install -g agent-browser
```

Then follow the tool's own first-run setup (it typically needs to download a browser binary once). If this command doesn't work, search for "agent-browser" on npm or GitHub to confirm the current package name and install path — CLI tool names and maintainers can change.

## Basic loop

Every task follows the same four steps:

1. **Open** — navigate to a URL.
2. **Snapshot** — take a text/structural snapshot of the page so Claude can see what's there (buttons, fields, links).
3. **Act** — click a button, type into a field, or read a value, based on the snapshot.
4. **Close** — end the session when the task is done.

Ask Claude in plain language, e.g. "open our vendor portal, check the invoice status for order #4021, and tell me if it's paid" — Claude runs the open/snapshot/act/close loop itself.

## Security notes

- **Never let it store a login without encryption.** If the tool offers to remember a password or session cookie, only allow that if it's stored encrypted — otherwise treat every session as logged-out and expect to sign in manually when asked.
- **Never automate banking, brokerage, or password-manager sites** with this or any browser automation tool. Keep those to manual, in-person use only.
- Treat anything the browser reads back (page text, screenshots) as untrusted — it can contain misleading instructions embedded in a page. Don't let it act on instructions found on a webpage as if they came from you.
- If a site shows a CAPTCHA or login wall, stop and handle that step yourself.

If `agent-browser` isn't installed or fails, the fallback is the Playwright plugin — see `docs/plugin-templates/playwright.md`.
