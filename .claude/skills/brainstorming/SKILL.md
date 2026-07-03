---
name: brainstorming
description: "Use when exploring a new business idea, initiative, project, offer, or decision before committing time, budget, or a team's effort to it. Turns a rough idea into an approved brief through one-question-at-a-time dialogue. Use before starting any new project, workflow change, hire, or offer — no matter how simple it looks."
---

<!-- Adapted from the open-source superpowers plugin (obra/superpowers) -->

## First-use setup (Claude: complete this, then delete this entire section)

This skill has not yet been adapted to this company. Before running it the first time:
1. Read company/overview.md and any other company/ files relevant to this skill (if empty, ask the user to run /onboard first).
2. Ask the user:
   - Where should design briefs be saved? Default is `projects/<topic>/brief.md`. → fills `{{BRIEF_LOCATION}}`
   - Should the self-review step also check drafts against `company/voice.md` (brand voice) before presenting them? → fills `{{BRAND_VOICE_CHECK}}`
3. Edit THIS file (`.claude/skills/brainstorming/SKILL.md`): replace every `{{PLACEHOLDER}}` with the real answers, adjust defaults to fit this company, then DELETE this entire "First-use setup" section.
4. Confirm to the user what was adapted, then proceed with their original request.

The presence of this section means the skill is uninitialized; its absence means initialized.

---

# Brainstorming Ideas Into Briefs

Turn a rough idea into a clear, approved brief through natural back-and-forth — before anyone commits budget, time, or headcount to it.

<HARD-GATE>
Do NOT invoke the writing-plans skill, spend money, tell the team to start, or take any other committing action until you have presented a brief and the user has approved it. This applies to every idea regardless of how simple it looks.
</HARD-GATE>

## Anti-pattern: "This is too small to need a brief"

Every idea goes through this process — a one-off email campaign, a single hire, a small process tweak, all of them. Small ideas are exactly where unexamined assumptions waste the most time. The brief can be three sentences for a truly simple idea, but it still needs to exist and be approved.

## Checklist

Work through these in order:

1. **Explore company context** — read `company/` files, `GOALS.md`, `decisions/log.md`, and any relevant `workflows/` so you're not re-litigating settled ground or ignoring stated priorities.
2. **Scope check** — if the request bundles several independent initiatives (e.g. "relaunch the website, hire a VA, and redo pricing"), flag this immediately and help decompose into separate ideas before refining any one of them.
3. **Ask clarifying questions, one at a time** — prefer multiple choice, open-ended is fine too. Focus on purpose, constraints, and what "success" looks like. Never stack more than one question in a message.
4. **Propose 2-3 approaches** — with tradeoffs, leading with your recommendation and why.
5. **Present the brief in sections** — scaled to complexity (a few sentences if simple, a short paragraph if nuanced). Ask after each section whether it looks right before moving on.
6. **Write the brief** to `{{BRIEF_LOCATION}}`.
7. **Self-review** (see below), fixing issues inline.
8. **User reviews the written brief** before you proceed to planning.
9. **Hand off to the writing-plans skill** — the only next step. Don't invoke anything else.

## Design for clear ownership

Break the idea into workstreams that each have one clear purpose, one clear owner, and a well-defined handoff to the next workstream. For each one, you should be able to answer: what does it produce, who owns it, and what does it depend on? If a workstream can't be explained without describing the whole project, or changing how it runs breaks something else, the boundaries need work.

## Working within how this company already operates

Check existing workflows and SOPs before proposing changes — follow established patterns rather than inventing new ones. If something already broken affects this specific idea, include a targeted fix in the brief. Don't scope-creep into unrelated fixes.

## Visual aids

No special tooling needed — if a comparison is clearer as a table or a short sketch of options, just write it inline in the chat as markdown. Don't reach for anything beyond that.

## Key principles

- **One question at a time.** Don't overwhelm with a list.
- **Multiple choice preferred** over open-ended, when it fits.
- **Cut scope ruthlessly** — no feature, step, or initiative nobody actually asked for.
- **Explore alternatives** — always propose 2-3 approaches before settling.
- **Incremental validation** — approve section by section, not all at once.
- **Be flexible** — go back and re-ask if something stops making sense.

## Self-review (before showing the user the written brief)

1. **Placeholder scan** — any "TBD", vague requirement, or incomplete section? Fix it.
2. **Internal consistency** — do any sections contradict each other?
3. **Scope check** — is this one coherent idea, or does it still need decomposition?
4. **Ambiguity check** — could any requirement be read two ways? Pick one and make it explicit.
5. **Brand/voice check** (only if `{{BRAND_VOICE_CHECK}}` is yes) — does the language match `company/voice.md`?

Fix issues inline — no need to re-run the whole review, just fix and move on.

## User review gate

After self-review passes:

> "Brief written and saved to `<path>`. Take a look and let me know if you want changes before we turn this into a plan."

Wait for their response. If they request changes, make them and re-check. Only proceed once they approve.
