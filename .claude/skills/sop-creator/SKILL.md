---
name: sop-creator
description: Use when the user wants to document a repeatable process, write down "how we do X", or runs /sop-creator. Interviews the user and produces a clear step-by-step SOP in workflows/.
---

# sop-creator

Turn a process that's currently "in someone's head" into a written SOP anyone on the team can follow.

## Interview

Ask, one at a time if the user hasn't already covered it in their request:

1. "What's the process called, and when does it start (what triggers it)?"
2. "Walk me through the steps, in order, as if you were training someone new."
3. "Where does it end -- what does 'done' look like?"
4. "Anything that commonly goes wrong, or a step people forget?"
5. "Which tools does each step use?" (name tools consistently with how they appear in other `workflows/*.md` files, so the same tool isn't called two different things across SOPs.)

Don't force all 5 questions if the user's first answer already covers most of it -- just fill gaps.

## Writing the SOP

Write to `workflows/<short-name>.md` (kebab-case, derived from the process name). Structure:

```
# <Process name>

**Trigger:** when this process starts
**Owner:** who normally runs this (if known)

## Steps
1. ...
2. ...

## Common mistakes
- ...

## Done when
...
```

Keep steps concrete and in plain language -- numbered, one action per step, no jargon the user didn't use themselves.

If a workflow with the same name already exists, show the user the existing version and ask whether to replace it or add a new variant, rather than silently overwriting.
