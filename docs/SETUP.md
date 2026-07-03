# Setup Guide

This repo IS your company's Claude Code workspace. There is no software to install to get started — the recommended path runs entirely in your browser.

## Path A: Claude Code on the web (recommended)

No installs, no terminal. Use this unless you already work in GitHub Desktop.

1. **Fork the template.** Open this repo on GitHub and click **Use this template** → **Create a new repository**. Name it after your company and keep it private if you prefer.
2. **Open Claude Code on the web.** Go to [claude.ai/code](https://claude.ai/code) and sign in with your Anthropic account.
3. **Connect GitHub.** The first time, claude.ai/code prompts you to install the **Claude GitHub App**. Follow the prompt and grant it access to your new repository (you can limit access to just this repo).
4. **Create your environment.** You'll be asked to name a cloud environment and pick network access (the default, "Trusted," is fine — it allows package installs but blocks general internet access).
5. **Open your repo and run onboarding.** Select your forked repo, start a session, and type:
   ```
   /onboard
   ```
   Follow the setup wizard (business, goals, voice samples, email connection, biggest time sink). It generates your `company/*.md` files and `GOALS.md`, connects your Gmail or Outlook 365 inbox, and drafts a starter workflow.

That's it — your workspace is live. Day to day, come back to claude.ai/code, open a session on your repo, and use `/morning`, `/inbox-triage`, and `/weekly-review`.

## Path B: Desktop app + GitHub Desktop (secondary)

Use this only if you want a local copy of the files (e.g., to attach local documents directly).

1. Install [GitHub Desktop](https://desktop.github.com).
2. On GitHub, click **Use this template** → **Create a new repository** to fork this repo under your account.
3. In GitHub Desktop: **File → Clone Repository**, pick your new repo, and choose a local folder — **see the warning below before you pick a folder.**
4. Install the Claude Code desktop app / CLI and open the cloned folder.
5. Run `/onboard` the same way as Path A.

## Never sync this repo through OneDrive, Google Drive, or Dropbox

**Do not clone or save this repo inside a folder that OneDrive, Google Drive, or Dropbox syncs.** These tools lock files mid-write and silently corrupt git's internal `.git` folder — you can lose history or end up with a repo git refuses to open. This isn't a maybe: it's the single most common way people break these workspaces.

- **GitHub is the source of truth**, not your hard drive. If a laptop dies, your company's brain is safe on GitHub.
- **Prefer Path A** (Claude Code on the web) — there are no local files to accidentally sync at all.
- If you use Path B, clone to a plain local folder (e.g., `Documents/CompanyOS`, not `OneDrive/Documents/CompanyOS`).
- You can still use your cloud-drive **files** (contracts, spreadsheets, decks) — just don't store the *repo* there. Connect Google Drive/OneDrive as an MCP connector so Claude can read those files as data, without the repo ever touching the sync folder.

## What happens after onboarding

Every day, use three things:
- `/morning` — a daily briefing based on your goals, today's calendar, and emails needing attention.
- `/inbox-triage` — walks your real email inbox and sorts each message into a reply draft, a project, or done.
- `/weekly-review` — a weekly recap and planning pass.

Didn't connect your email during onboarding? See `docs/integrations/email.md` — it takes about 5 minutes.

For messaging integrations (Slack, Teams, Telegram), see `docs/integrations/`. For optional add-ons (browser automation, document creation, session memory), see `docs/tools/` and `docs/plugin-templates/`.

If you get stuck, the official Claude Code docs are at [docs.claude.com](https://docs.claude.com).
