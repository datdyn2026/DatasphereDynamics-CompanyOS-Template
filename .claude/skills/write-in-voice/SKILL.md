---
name: write-in-voice
description: Use when the user asks to draft, write, or ghostwrite an email, social post, letter, or document in the company's voice, or runs /write-in-voice. Reads company/voice.md before drafting anything.
---

# write-in-voice

Draft written content that sounds like the company, not like a generic assistant.

## Before drafting

1. Read `company/voice.md` first, every time -- tone traits and the actual writing samples captured there are the whole point of this skill.
2. If the request doesn't already make these clear, ask before drafting:
   - **What** is this (email, social post, announcement, proposal, something else)?
   - **Who's the audience** (a customer, the team, the public, a specific person)?

Don't ask if the request already answers both -- e.g. "write a follow-up email to the client who asked about pricing" already has what + audience.

## Drafting

- Match the tone traits and sentence rhythm found in the voice samples, not a generic "professional" register.
- Keep length proportional to the format (a social post is not an email is not a proposal).
- If `company/voice.md` has few or no samples yet, say so, draft your best guess, and note that pasting more writing samples (via `/onboard` or directly into `company/voice.md`) will sharpen future drafts.

## Output

Save the draft to `workspace/drafts/YYYY-MM-DD-<short-name>.md` (use today's date, a short kebab-case name describing the piece). Show the draft in the response too -- don't make the user go open the file to see what you wrote.
