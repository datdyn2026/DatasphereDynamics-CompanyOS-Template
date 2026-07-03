---
name: decision-log
description: Use when the user says "log this decision", "record that we decided...", or runs /decision-log. Captures a decision with its reasoning and appends it to decisions/log.md.
---

# decision-log

Capture one decision so the reasoning isn't lost later. This is an append-only log -- never rewrite or delete earlier entries.

## Capture

If the user's message doesn't already cover these, ask briefly:

1. **The decision** -- what was decided, in one sentence.
2. **Why** -- the reasoning behind it.
3. **Alternatives considered** -- what else was on the table, and why it lost out (skip this if there genuinely wasn't another option).

Don't interrogate for detail the user hasn't offered -- a terse decision is still worth logging.

## Write

Append (never overwrite) an entry to `decisions/log.md` in this format:

```
## YYYY-MM-DD -- <short decision title>

**Decision:** ...
**Why:** ...
**Alternatives considered:** ...
```

Use today's date. Add the new entry at the end of the file (or under a clear "most recent" convention if the file already establishes one -- check the existing file structure before appending).

Confirm back to the user with the one-line title once it's saved -- no need to reprint the whole log.
