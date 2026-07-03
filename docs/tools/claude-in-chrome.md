# Claude in Chrome

"Claude in Chrome" is Anthropic's official browser extension. It lets Claude Code drive **your actual Chrome browser** — the one you're already logged into — to test websites, check on portals, and do browser tasks as part of a coding or work session, in a visible window you can watch.

## What it does

- Opens new tabs and interacts with pages in real time, in a browser window you can see.
- Shares your browser's login state, so it can access any site you're already signed into — this is powerful, and also why the safety rules below matter.
- Pauses and asks you to take over manually whenever it hits a login page or a CAPTCHA.

Works with Google Chrome and Microsoft Edge. Not yet supported on Brave, Arc, or other Chromium-based browsers, and not supported under Windows Subsystem for Linux (WSL).

## Install

1. Install the extension from the Chrome Web Store: search the store for **"Claude"** (published by Anthropic), or follow the link from the official docs at [code.claude.com/docs/en/chrome](https://code.claude.com/docs/en/chrome).
2. In Claude Code, connect to Chrome with:
   ```
   claude --chrome
   ```
   or run the `/chrome` command inside a session to enable it going forward.
3. Requires a Claude plan with Claude Code access (Pro, Max, Team, or Enterprise) and a reasonably current Claude Code version.

If any step looks different from what's above, the extension and CLI flag are still evolving — check the official guide rather than guessing: [docs.claude.com](https://docs.claude.com).

## Safety rules (read before using)

Because this drives your **real, logged-in** browser — not a clean sandboxed one — treat it like handing a very capable assistant your open browser tabs:

- **Never let it touch banking or brokerage sites, crypto wallets, or password managers.** These use your real credentials and can move real money or expose all your other passwords.
- **Never let it touch your personal email** unless you're watching every step and it's a task you specifically asked for.
- **Always confirm before it submits, sends, or purchases anything.** Watch the screen; don't let a task run unattended through a "submit" or "send" button.
- Treat anything the page shows back to Claude (text, screenshots, pop-ups) as untrusted content — a malicious page could try to plant instructions. Don't let page content override what you actually asked for.
- If you're ever redirected to a login wall you didn't expect, stop and check what's happening before typing anything.

Used within these limits, it's a great way to have Claude check a form, verify a live webpage matches a design, or debug something visually — just keep it away from anything that touches money or master passwords.
