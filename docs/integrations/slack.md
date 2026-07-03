# Slack Integration

Anthropic ships an official Claude Code integration for Slack: mention `@Claude` in a channel with a coding or task request, and Claude runs the work as a cloud session, then posts progress and a pull request link back to the channel. This is the primary nontechnical way to use this workspace from Slack — no terminal involved.

## Requirements

- A Claude plan with Claude Code access (Pro, Max, Team, or Enterprise).
- Claude Code on the web enabled for your account (see `docs/SETUP.md`, Path A).
- Your company repo (this repo) connected to Claude Code on the web via GitHub — **the repo must be on GitHub**.
- Your Slack account linked to your Claude account.

## Setup

1. **Install the Claude app in Slack.** A Slack workspace admin visits the [Slack App Marketplace](https://slack.com/marketplace) and adds the Claude app to your workspace. (Admins control whether the app is available at all; removing it revokes access instantly for everyone.)
2. **Connect your Claude account.** Open the Claude app in Slack, go to the **Home** tab, and click **Connect**. This links your individual Slack identity to your Claude account — each person's sessions run under their own account and plan limits.
3. **Make sure your repo is connected.** If you haven't already, connect this repo to Claude Code on the web at [claude.ai/code](https://claude.ai/code) (see `docs/SETUP.md`).
4. **Choose how @Claude behaves** (workspace-level setting): "Code only" routes every @mention to a coding session; "Code + Chat" lets Claude decide whether a message is a coding task or a general question.
5. **Add Claude to a channel.** Type `/invite @Claude` in any channel where you want to use it. Claude only responds to @mentions in channels it's been invited to — this is how you control who can trigger it.

## Using it

Mention `@Claude` with a task, e.g. `@Claude update the icp.md file with our new target segment`. Claude detects it's a coding/repo task, opens a session against your connected repo, and works in the background. It posts progress updates in the thread and, when done, a link to review or merge the resulting pull request.

## Good to know

- Each session uses **your own** connected repositories and counts against **your own** plan's usage limits.
- Currently GitHub repos only; one pull request per session.
- Session history is viewable anytime at [claude.ai/code](https://claude.ai/code).
- Anthropic is transitioning larger (Team/Enterprise) workspaces to a successor called "Claude Tag" — same app, no reinstall needed, so the steps above keep working either way.

For exact current screens and any menu wording (these change over time), see the official guide: [docs.claude.com](https://docs.claude.com), specifically the "Claude Code in Slack" page.
