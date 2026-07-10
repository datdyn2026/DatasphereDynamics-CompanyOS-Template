# Plugin Templates

This folder documents optional power-ups for your Claude Code workspace. None of them are required — the base template works fully without any of them. Each one solves a specific extra need; read the relevant page, decide if you want it, and install it in about a minute.

The full add-ons catalog (plugins plus local skills, agents, and guards) is [`docs/addons.md`](../addons.md).

## What's here

| Plugin | Adds | File |
|---|---|---|
| claude-mem | Remembers context across sessions, so you don't re-explain things | `claude-mem.md` |
| superpowers | Software development methodology (planning, TDD, debugging) — for clients who also build software | `superpowers.md` |
| skill-creator | Tooling to build, test, and benchmark your own custom skills | `skill-creator.md` |
| playwright | Browser automation fallback, for when `agent-browser` isn't available | `playwright.md` |

## How installing a plugin works

Every plugin installs the same two-step way, run inside a Claude Code session:

1. **Register the marketplace it lives in** (a one-time step per marketplace):
   ```
   /plugin marketplace add <owner>/<repo>
   ```
2. **Install the plugin**:
   ```
   /plugin install <plugin-name>@<marketplace-name>
   ```

Each page in this folder gives you the exact commands to copy for that plugin — you don't need to remember the pattern above, just follow the page.

To see what's currently installed, or to remove a plugin later, use the `/plugin` command inside a session and browse the menu.
