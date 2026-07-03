---
name: skill-builder
description: Use when someone wants to create a new business skill (a reusable playbook for Claude), improve an existing one, or figure out why a skill isn't triggering reliably.
---

<!-- Adapted from Anthropic's skill-creator -->

## First-use setup (Claude: complete this, then delete this entire section)

This skill has not yet been adapted to this company. Before running it the first time:
1. Read company/overview.md and any other company/ files relevant to this skill (if empty, ask the user to run /onboard first).
2. Ask the user:
   - What recurring tasks feel like good first candidates to turn into skills (e.g. weekly reporting, client onboarding emails, invoice follow-ups)? → fills `{{CANDIDATE_SKILLS}}`
   - Does a new skill need anyone's sign-off before it's used for real work, or can it go live once it's tested? → fills `{{SKILL_APPROVAL_PROCESS}}`
   - Are there any topics this company never wants automated, beyond the standard safety rule below? → fills `{{SKILL_NO_GO_LIST}}`
3. Edit THIS file (`.claude/skills/skill-builder/SKILL.md`): replace every `{{PLACEHOLDER}}` with the real answers, adjust defaults to fit this company, then DELETE this entire "First-use setup" section.
4. Confirm to the user what was adapted, then proceed with their original request.

The presence of this section means the skill is uninitialized; its absence means initialized.

---

# Skill Builder

A skill is a reusable playbook: write the steps once, and Claude follows them the same way every time instead of you re-explaining the process each time. Use this to create a new skill or fix one that isn't working well.

## Anatomy of a skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Plain-language instructions
└── references/ (optional — extra detail Claude reads only when needed)
```

Keep SKILL.md itself under ~150 lines. If it's growing past that, move the detail into a `references/<topic>.md` file and point to it from SKILL.md — Claude only loads that file when the skill actually needs it.

## Creating a new skill

**1. Capture intent.** If the user just did something worth repeating ("turn this into a skill"), look at what actually happened — the steps taken, the corrections made — and draft from that. Otherwise ask: What should this skill let Claude do? When should it trigger — what would someone actually say? What should the output look like?

**2. Interview.** One question at a time about edge cases, inputs/outputs, and what "good" looks like. Bring a draft with you so the user isn't starting from a blank page.

**3. Write the description first.** The description is the only thing Claude sees before deciding whether to use the skill — get it right. Start with "Use when..." and name concrete triggering situations, not just what the skill does. Lean slightly insistent — Claude tends to under-use skills that undersell themselves.
- Weak: "Helps with customer emails."
- Better: "Use when drafting or replying to a customer email, especially refund requests, complaints, or anything needing the company's standard tone. Trigger even if the user just pastes an email and says 'reply to this.'"

**4. Write the body.**
- Use imperative instructions ("Ask the user X," not "the user should be asked X").
- Explain *why* a step matters instead of stacking bare rules — it lets Claude use judgment on cases that don't exactly match the example.
- Include at least one concrete example of input → output.
- If the skill needs company-specific details to work (names, tool lists, defaults), give it a "First-use setup" section like this one so the first real run adapts it to this company.

**5. Test it.** Come up with 2-3 requests a real person would actually send — not idealized prompts. Run them yourself, or have a teammate try. Check whether it triggered and whether the output matched what was wanted. Show the results to whoever asked for the skill and ask what's missing or wrong.

**6. Iterate.** Fix what the feedback flagged, favoring a clearer explanation of intent over another rigid rule bolted on. Re-test only the cases that had a problem. Stop when the requester is happy or you're no longer making real progress.

## Improving an existing skill

1. Read the current SKILL.md in full before changing anything.
2. Ask what specifically isn't working — wrong trigger, wrong output, a step that keeps getting skipped.
3. Generalize the fix. If the complaint is "it didn't handle this one client's odd case," don't hardcode that case — find the underlying rule and state it plainly.
4. Re-test the failing cases, confirm with whoever asked, done.

## Fixing a skill that won't trigger

Most non-triggering skills have a vague or too-narrow description. Rewrite it to: start with "Use when," list the concrete situations or phrases that should trigger it, and note what it should explicitly NOT handle if it's easily confused with something else. Test a few realistic phrasings before and after the rewrite.

## Safety

A skill's contents should never surprise its own description. Don't build a skill meant to bypass a safety rule, quietly exfiltrate data, or act beyond what its description discloses. `{{SKILL_NO_GO_LIST}}`

## Where skills live

New skills go in `.claude/skills/<name>/SKILL.md` in this repo. `{{SKILL_APPROVAL_PROCESS}}`

## Good first candidates for this company

`{{CANDIDATE_SKILLS}}`
