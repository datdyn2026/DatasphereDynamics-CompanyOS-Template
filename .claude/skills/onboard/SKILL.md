---
name: onboard
description: Use when the user says "onboard me", "set up my company", runs /onboard, or a SessionStart hook reports the workspace isn't onboarded yet. Runs a guided ~15-minute interview that fills in company/*.md, GOALS.md, and a first workflow. Only run once per workspace (checks for .claude/.onboarded first).
---

# onboard

Guided interview that turns a blank CompanyOS into a working one. Plain language throughout -- the person answering is not technical.

## Before starting

Check if `.claude/.onboarded` exists. If it does, tell the user the workspace is already set up and ask if they want to redo a specific section instead of the full interview (route them to the relevant piece: team changes -> update `company/team.md` directly, new goals -> `/decision-log` or a direct edit, etc.). Do not re-run the full interview on an already-onboarded workspace without explicit confirmation.

## How to run it

One topic at a time. Ask, wait for the real answer, write it into the matching file immediately, then move on -- so if the user stops halfway, everything asked so far is already saved. Keep each question short and conversational; don't dump all 7 up front.

Open with one line: "Let's get your workspace set up -- about 6 short questions, 15 minutes. I'll save your answers as we go, so you can stop anytime and pick back up later."

### 1. Business + model
Ask: "What does your business do, and how does it make money? (Also -- are you pre-revenue, early-stage, established?)"
Write the answer into `company/overview.md`, replacing the placeholder content (keep the file's existing section headers if present, just fill them in).

### 2. Team
Ask: "Who's on the team? For each person, their name, role, and what people usually come to them for."
Write into `company/team.md`.

### 3. Top 3 goals
Ask: "What are your top 3 goals for this quarter (or right now if you don't think in quarters)?"
Write into `GOALS.md` at the repo root -- this is the file every other skill reads to know what "priority" means, so phrase goals as concrete, checkable outcomes, not vague aspirations.

### 4. Voice samples
Ask: "Paste 2-3 things you've actually written -- an email, a social post, a note to a customer. Anything that sounds like you." Do not paraphrase these -- capture the actual text.
Write them into `company/voice.md` under a "writing samples" section, plus a short bullet list of tone traits you notice (e.g. short sentences, no jargon, direct asks).

### 5. Tools used
Ask: "What tools do you run the business on? (CRM, email, calendar, invoicing, docs, anything else.)"
Write into `company/connections.md` as a simple registry: tool name, what it's used for.

### 6. Biggest time sink
Ask: "What's the one repeatable task that eats the most time or annoys you most?"
From the answer, draft one starter SOP and write it to `workflows/<short-name>.md` (kebab-case name derived from the task, e.g. `workflows/weekly-invoicing.md`). Keep it short: numbered steps, marked clearly as a first draft the user should correct. Tell the user you did this and that `/sop-creator` can refine it or add more SOPs later.

## Finishing up

1. Personalize the `CLAUDE.md` header line at the repo root with the company name the user gave you in step 1 (edit only that header line -- do not rewrite the rest of the router file; it's maintained separately).
2. Create the marker file `.claude/.onboarded` (empty file is fine) so the SessionStart hook stops nudging toward onboarding.
3. Close with a short wrap-up message teaching the 3 daily habits:
   - `/morning` -- run it each morning for a quick brief tied to your goals.
   - Drop anything into `inbox/` -- notes, links, half-formed ideas -- and run `/inbox-triage` when ready to sort it.
   - `/weekly-review` -- a short end-of-week reflection and progress check.
4. Mention that the voice-manager agent wants more voice samples over time -- paste more writing samples whenever you have them, and it will keep sharpening the voice profile so future drafts sound more like you.

## Notes

- Never invent answers. If the user skips a question, leave the placeholder in place and note it's still open.
- No real personal data belongs in this file itself -- it's a template; actual answers only ever get written to the user's own `company/*.md` files at runtime.
