---
name: writing-plans
description: Use when you have an approved brief or requirements for a multi-step initiative, before any work begins.
---

<!-- Adapted from the open-source superpowers plugin (obra/superpowers) -->

## First-use setup (Claude: complete this, then delete this entire section)

This skill has not yet been adapted to this company. Before running it the first time:
1. Read company/overview.md and any other company/ files relevant to this skill (if empty, ask the user to run /onboard first).
2. Ask the user:
   - Where should plans be saved? Default is `projects/<topic>/plan.md` (or `workflows/<name>.md` if this is a repeatable process rather than a one-off project). → fills `{{PLAN_LOCATION}}`
   - What recurring global constraints should every plan fold in (budget ceiling, deadlines, compliance rules, brand rules)? → fills `{{GLOBAL_CONSTRAINTS}}`
   - When a plan is ready, does Claude usually execute the tasks directly with check-ins, or hand the full plan to the team? → fills `{{EXECUTION_HANDOFF_DEFAULT}}`
3. Edit THIS file (`.claude/skills/writing-plans/SKILL.md`): replace every `{{PLACEHOLDER}}` with the real answers, adjust defaults to fit this company, then DELETE this entire "First-use setup" section.
4. Confirm to the user what was adapted, then proceed with their original request.

The presence of this section means the skill is uninitialized; its absence means initialized.

---

# Writing Plans

## Overview

Write plans assuming whoever executes them (a team member or Claude) has zero background on this company and needs explicit direction. Document: who owns each phase, what "done" looks like, what's needed to start, and how phases depend on each other. Break the work into bite-sized phases and steps. Avoid duplicated effort across phases, and don't plan more than what's actually needed right now.

**Announce at start:** "I'm using the writing-plans skill to turn this brief into a plan."

**Save plans to:** `{{PLAN_LOCATION}}` (user preference overrides this default).

## Scope Check

If the brief covers multiple independent workstreams that should have been split during brainstorming, suggest splitting into one plan per workstream. Each plan should produce a working, checkable outcome on its own.

## Phase & Owner Structure

Before defining phases, map out who owns each one and what it produces — this is where decomposition gets locked in.
- Each phase has one clear owner (a person, a role, or "Claude") and one clear deliverable.
- If a phase depends on another, say so explicitly — what does phase 3 need from phase 1?
- Follow how this company already organizes work; don't invent new structures where an existing workflow already covers it.

## Phase Right-Sizing

A phase is the smallest unit that has its own "done" check and is worth a stakeholder's sign-off. Fold setup and prep into the phase that needs it. Split phases only where someone could reasonably approve one while sending its neighbor back for rework.

## Bite-Sized Steps

Each step is one concrete action, assignable to a single person or to Claude, completable in one sitting: "Draft the [deliverable]," "Send to [stakeholder] for review," "Revise per feedback," "Get sign-off," "Log the decision in decisions/log.md and mark done."

## Plan Document Header

Every plan starts with:

```markdown
# [Initiative Name] Plan

**Goal:** [one sentence describing the outcome]
**Approach:** [2-3 sentences on how]
**Owners:** [who's involved and their roles]

## Global Constraints
[Company-wide requirements every phase must respect — budget ceiling, deadline,
brand rules, compliance requirements — one line each: {{GLOBAL_CONSTRAINTS}}]

---
```

## Phase Structure

```markdown
### Phase N: [Name]

**Owner:** [person or role]
**Depends on:** [earlier phase, or "none"]
**Produces:** [what later phases or the business need from this phase]

- [ ] **Step 1: [Action]** — Done when: [concrete, checkable criterion]
- [ ] **Step 2: [Action]** — Done when: [concrete, checkable criterion]
- [ ] **Step 3: Sign-off from [owner]**
```

## No Placeholders

These are plan failures — never write them into a finished plan:
- "TBD," "handle appropriately," "figure out details later"
- "Similar to Phase 2" (repeat the actual content — people may read phases out of order)
- A step with no "done when" criterion
- A reference to a deliverable or role never defined in any phase

## Remember

- Real names, real dates, real numbers — no unresolved placeholders in the finished plan
- Every step has a concrete, checkable "done when"
- No duplicated effort across phases, no unrequested scope

## Self-Review

After writing the full plan, check it against the brief with fresh eyes:
1. **Brief coverage** — can you point to a phase for every requirement in the brief? List gaps.
2. **Placeholder scan** — search for the red flags above.
3. **Consistency** — do owner names and deliverable names match everywhere they're referenced?

Fix issues inline — no need to re-review, just fix and move on. If a brief requirement has no phase, add one.

## Execution Handoff

After saving the plan, ask:

**"Plan saved to `<path>`. How do you want to proceed: (1) I start on phase 1 now and check in with you between phases, or (2) hand this plan to your team to execute?"**

Default for this company: `{{EXECUTION_HANDOFF_DEFAULT}}`.
