# Telegram Integration

Honest answer up front: **there is no first-class "Claude Code for Telegram" integration shipped with this template**, unlike Slack. There are two real paths, one lightweight and account-dependent, one a developer add-on.

## Option A: Claude Code channels (research preview)

Anthropic has previewed "channels" support for messaging apps beyond Slack, including Telegram, as a research preview. Availability depends on your Anthropic account and plan and may not be turned on yet. Check the official docs for current status before promising this to anyone: [docs.claude.com](https://docs.claude.com).

If it's available to your account, it works the same way as Slack in spirit: message an assistant in a Telegram chat, it runs a Claude Code session, and reports back — but treat the exact setup steps as unconfirmed until you see them in your own account, since this is a preview feature that changes.

## Option B: A small custom bot (developer add-on)

Telegram is a favorite pragmatic choice for teams that want a chat bot fast, because its Bot API is simple and free. A basic version looks like:

- Create a bot with **@BotFather** in Telegram to get a bot token.
- Run a small service (using the **Telegram Bot API** plus the **Claude Agent SDK**) that receives messages via the bot's webhook or long-polling, sends them to Claude, and replies with the result.
- Host that service somewhere always-on (a small VM or serverless function).
- Optionally connect it to this repo via GitHub so the bot can kick off real Claude Code sessions.

This is a few hours of work for a developer, not a nontechnical afternoon project — treat it as a paid add-on rather than something to self-serve.

## Bottom line

Check whether Claude Code channels support Telegram on your account first — it's the zero-build option. If not available, a custom bot is straightforward for a developer to add later; it isn't part of this template's default scope.
