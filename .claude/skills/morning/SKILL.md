---
name: morning
description: Use when the user says "morning", "give me my brief", "what should I focus on today", or runs /morning. Produces a short daily briefing tied to current goals, unprocessed inbox items, and stale open work.
---

# morning

A short daily brief, not a report. Read only what's needed, keep the output tight (aim for well under a page).

## What to read

1. `GOALS.md` -- the current priorities everything else should tie back to.
2. `decisions/log.md` -- only the most recent entries (last 7 days or the last handful of entries, whichever is smaller). This is an append-only log; don't read the whole history.
3. `inbox/` -- list what's sitting there unprocessed.
4. `projects/` -- open project folders; check each `brief.md` (or equivalent) for a status line if one exists.

Skip `company/*.md` and `workflows/` entirely -- not needed for a daily brief.

## What to produce

A short brief with these sections, in this order:

1. **Today's focus** -- 1-3 items, each tied explicitly to one of the goals in `GOALS.md` (name which goal). If nothing in flight maps to a goal, say so plainly instead of forcing a connection.
2. **Inbox needs triage** -- how many items are sitting in `inbox/`, and if there are 5 or fewer, name them; otherwise just the count and a nudge to run `/inbox-triage`.
3. **Anything stale** -- open projects with no recent activity, or a goal with zero related work this week. Call these out directly, don't soften them into praise.

Do not restate the goals verbatim, don't pad with encouragement, and don't propose new goals -- that's not this skill's job. If `GOALS.md` is empty or missing, say the workspace hasn't been onboarded yet and suggest `/onboard`.
