---
name: weekly-review
description: Use when the user says "weekly review", "how did this week go", or runs /weekly-review. Reflects on the week against goals, asks a few questions, then writes a short report to workspace/reports/.
---

# weekly-review

A short, honest weekly check-in -- not a status report written to look busy.

## Read first

1. `GOALS.md` -- what the quarter/current goals are.
2. `decisions/log.md` -- entries from the last 7 days only.
3. `workspace/` outputs from the last 7 days (drafts, reports, logs) -- to see what was actually produced.
4. `projects/` -- status of open projects.
5. **The week in email/calendar** (only if email MCP tools are available -- the server the user linked during `/onboard`): meeting load for the week and any notable threads still waiting on the user. Read-only; skip silently if email isn't connected.

## Ask before writing

This skill is conversational. Ask 2-3 short reflection questions before drafting the report, e.g.:
- "What felt like a win this week?"
- "What's stuck, or slower than expected?"
- "Anything that should change about next week's focus?"

Wait for real answers -- don't skip straight to writing a report based only on file contents. The user's read on the week matters as much as what's on disk.

## Write the report

Save to `workspace/reports/YYYY-MM-DD-weekly-review.md` (today's date). Structure:

```
# Weekly Review -- YYYY-MM-DD

## Progress vs goals
(one line per goal in GOALS.md: on track / behind / done, with why)

## Week in numbers
(only if email is connected: meetings held, threads still waiting on you -- one line)

## Wins
...

## Stuck / blocked
...

## Next week's focus
...
```

Keep it short -- this is a habit-forming ritual, not a document someone has to budget time to read. If a goal in `GOALS.md` had zero related activity this week, say that plainly rather than stretching unrelated work to cover it.
