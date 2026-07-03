---
name: inbox-triage
description: Use when the user says "triage my inbox", "go through my inbox", "clear the inbox", or runs /inbox-triage. Walks through inbox/ items one at a time and sorts each into an action.
---

# inbox-triage

Anything can land in `inbox/` -- a link, a half-formed idea, a note typed on a phone. This skill sorts it, one item at a time, so nothing sits there unprocessed forever.

## Process

For each item in `inbox/` (oldest first is a reasonable default, but ask if the user wants a different order):

1. Show the item's content (or a short summary if it's long).
2. Propose one of four routes, and ask the user to confirm or pick a different one:
   - **Do now** -- it's small enough to just handle in this session. Do it, then move the source file to `archive/`.
   - **Make it a project** -- it's a real initiative. Create `projects/<short-name>/brief.md` with a one-paragraph summary of what it is and why, move the original file into that project folder (or reference it), and remove it from `inbox/`.
   - **Add to a workflow** -- it's a recurring task that belongs in an existing SOP, or is the seed of a new one. Either append a note to the relevant `workflows/<name>.md`, or suggest running `/sop-creator` for a new one. Move the source file to `archive/`.
   - **Archive** -- not actionable, but worth keeping. Move it to `archive/` as-is.
3. Confirm the move before doing it if there's any ambiguity about which route is right -- don't guess silently on judgment calls.

## After finishing

Give a one-line summary: how many items processed, how many became projects, how many archived. Don't re-list every item again.

If `inbox/` is empty, say so and stop -- there's nothing to triage.
