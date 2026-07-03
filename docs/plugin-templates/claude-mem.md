# claude-mem — Persistent Session Memory

## What it adds

By default, each Claude Code session starts fresh — Claude doesn't remember what happened last time unless it's written down in your `company/` files or `decisions/log.md`. **claude-mem** changes that: it quietly compresses what happens in each session (files read, edits made, decisions reached) into a memory store, and automatically feeds relevant pieces of that memory back into your next session.

In practice: after your second session in this workspace, Claude starts arriving with context from earlier sessions already in mind — you spend less time re-explaining what you told it last week.

Everything it captures stays on your own machine (in a local folder, `~/.claude-mem`); nothing leaves your computer except the normal calls to whichever AI provider is doing the compression.

## Install

Run inside a Claude Code session:

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
```

## What changes for you

- Nothing to do day-to-day — it works in the background after install.
- Optionally, run `/learn-codebase` once after installing to have Claude read through this whole repo up front and seed its memory in one pass (a few minutes).
- If you ever want to remove it and its stored data, uninstalling the plugin cleans up the local memory folder too.

This is a convenience layer, not a requirement — the base template works fine without it. Add it if you find yourself repeating the same context to Claude every session.
