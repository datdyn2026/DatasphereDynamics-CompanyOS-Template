---
name: morning
description: Use when the user says "morning", "give me my brief", "what should I focus on today", or runs /morning. Produces a short daily briefing tied to current goals, today's calendar, emails needing attention, and stale open work.
---

# morning

A short daily brief, not a report. Read only what's needed, keep the output tight (aim for well under a page).

## What to read

1. `GOALS.md` -- the current priorities everything else should tie back to.
2. `decisions/log.md` -- only the most recent entries (last 7 days or the last handful of entries, whichever is smaller). This is an append-only log; don't read the whole history.
3. **Today's calendar and recent email** -- via the connected email MCP tools (whatever server the user linked during `/onboard`; look for calendar/email tools among available MCP tools). Pull today's events and unread or clearly-important recent emails. If no email tools are available, note once: "Email isn't connected yet -- run /onboard to link Gmail or Outlook" and continue with local sources only.
4. `projects/` -- open project folders; check each `brief.md` (or equivalent) for a status line if one exists.

Skip `company/*.md` and `workflows/` entirely -- not needed for a daily brief.

## What to produce

A short brief with these sections, in this order:

1. **Today's focus** -- 1-3 items, each tied explicitly to one of the goals in `GOALS.md` (name which goal). If nothing in flight maps to a goal, say so plainly instead of forcing a connection.
2. **Today's calendar** -- the day's meetings/events in one glance, flagging conflicts or back-to-backs. Omit the section if email isn't connected.
3. **Emails needing attention** -- up to 5, each in one line (who, what they want, suggested next move: reply / delegate / ignore). If there are more, give the count and suggest `/inbox-triage`. Omit the section if email isn't connected.
4. **Anything stale** -- open projects with no recent activity, or a goal with zero related work this week. Call these out directly, don't soften them into praise.

Do not restate the goals verbatim, don't pad with encouragement, and don't propose new goals -- that's not this skill's job. Reading email is fine without asking; never send, archive, or modify anything from this skill. If `GOALS.md` is empty or missing, say the workspace hasn't been onboarded yet and suggest `/onboard`.
