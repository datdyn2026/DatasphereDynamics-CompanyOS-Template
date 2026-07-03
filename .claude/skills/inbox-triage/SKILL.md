---
name: inbox-triage
description: Use when the user says "triage my inbox", "go through my email", "clear my inbox", or runs /inbox-triage. Walks through the user's real email inbox (connected during /onboard) and sorts each item into an action.
---

# inbox-triage

Works through the user's real email inbox -- the one connected during `/onboard` -- so nothing sits there unanswered forever. One item at a time, user confirms every action.

## Before starting

Check that email MCP tools are available (whatever server the user linked during `/onboard`). If none are, say "Email isn't connected yet -- run /onboard to link Gmail or Outlook" and stop.

## Process

Fetch recent unread (or flagged/important) emails -- default to the last 2-3 days or ~15 items, whichever is smaller; ask if the user wants a different scope. Then for each item, oldest first:

1. Show a one-line summary: who it's from, what they want.
2. Propose one of four routes. **Nothing happens to any email until the user confirms the route for that specific message** -- no drafts, no archiving, no labels on your own judgment:
   - **Needs a reply** -- draft the reply in the user's voice (`company/voice.md`) and show it in full (to, subject, body) before saving it as a **draft in their mailbox**, so they see exactly what will sit in their email app. Never send it yourself unless the user explicitly says "send it" for that specific message -- sending always needs a per-message yes.
   - **Make it a project** -- it's a real initiative. Create `projects/<short-name>/brief.md` with a one-paragraph summary of what it is and why, referencing the email by sender/subject/date -- don't paste the full email body into the repo.
   - **Add to a workflow** -- it's a recurring task that belongs in an existing SOP, or the seed of a new one. Append a note to the relevant `workflows/<name>.md`, or suggest `/sop-creator` for a new one.
   - **Done with it** -- archive or label the email as handled (if the connected server supports it), or just skip past it.

If the connected server turns out to be read-only (no draft/archive tools), degrade gracefully: put the drafted reply text in chat for the user to copy into their email app, and skip the archive step.

## After finishing

Give a one-line summary: how many emails processed, how many reply drafts created, how many became projects. Don't re-list every item again.

If there's nothing unread or flagged, say so and stop -- there's nothing to triage.
