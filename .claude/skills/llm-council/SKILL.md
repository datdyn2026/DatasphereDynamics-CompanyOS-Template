---
name: llm-council
description: "Use when a business decision carries real stakes and multiple viable options — pressure-tests it through a council of 5 AI advisors who independently analyze it, peer-review each other anonymously, and synthesize a final verdict. Adapted from Andrej Karpathy's LLM Council methodology. MANDATORY TRIGGERS: 'council this', 'run the council', 'war room this', 'pressure-test this', 'stress-test this', 'debate this'. STRONG TRIGGERS (when paired with a real decision or tradeoff): 'should I X or Y', 'which option', 'what would you do', 'is this the right move', 'validate this', 'get multiple perspectives', 'I can't decide', 'I'm torn between'. Do NOT trigger on simple yes/no questions, factual lookups, or a casual 'should I' with no real tradeoff. DO trigger when the user presents a genuine decision with stakes, multiple options, and a sense they want it examined from more than one angle."
---

## First-use setup (Claude: complete this, then delete this entire section)

This skill has not yet been adapted to this company. Before running it the first time:
1. Read company/overview.md and any other company/ files relevant to this skill (if empty, ask the user to run /onboard first).
2. Ask the user:
   - Which recurring categories of decisions should the council expect (e.g. pricing, hiring, vendor selection, market expansion)? → fills `{{COUNCIL_FOCUS_AREAS}}`
   - Do the default 5 thinking-style advisors cover this company's blind spots, or is there one specialist angle worth adding as a 6th (e.g. Compliance, Brand, Finance)? → fills `{{OPTIONAL_6TH_ADVISOR}}`
   - Where should saved transcripts live? Default is `workspace/council/`. → fills `{{TRANSCRIPT_LOCATION}}`
3. Edit THIS file (`.claude/skills/llm-council/SKILL.md`): replace every `{{PLACEHOLDER}}` with the real answers, adjust defaults to fit this company, then DELETE this entire "First-use setup" section.
4. Confirm to the user what was adapted, then proceed with their original request.

The presence of this section means the skill is uninitialized; its absence means initialized.

---

# LLM Council

One AI answer is one perspective. You have no way to tell if it's great or just mid. The council fixes this: it runs a question through 5 independent advisors who each think from a different angle, has them review each other's work, then a chairman synthesizes everything into a verdict that shows where they agree, where they clash, and what to actually do.

## When to run the council

Good council questions have genuine uncertainty and a real cost to being wrong: "Should we raise prices or add a premium tier?" "Which of these two positioning angles is stronger?" "We're thinking of dropping a product line — are we missing something?" "Here's our proposal to a client — what's weak?"

Bad council questions have one right answer or aren't a decision at all: factual lookups, "write me an email," "summarize this doc." Skip the council for those — just answer directly.

## The five advisors (default roster)

These are thinking styles, not job titles — they create deliberate tension.

1. **The Contrarian** — hunts for what's wrong, missing, or likely to fail. Not a pessimist; the friend who asks the question you're avoiding.
2. **The First Principles Thinker** — ignores the surface question and asks "what are we actually trying to solve?" Sometimes the most valuable output is "you're asking the wrong question."
3. **The Expansionist** — looks for the upside everyone else is missing. Doesn't weigh risk (that's the Contrarian's job); asks what happens if this works better than expected.
4. **The Outsider** — has zero context on the company or its history. Catches the curse of knowledge: things obvious to insiders but confusing to everyone else.
5. **The Executor** — cares only about what can actually be done and how fast. If an idea has no clear first step, the Executor says so.

**Optional 6th advisor for this company:** `{{OPTIONAL_6TH_ADVISOR}}` (default: none — the five above cover most business decisions on their own).

## How a session works

**Step 1 — Frame the question.** Scan `company/` files, `decisions/log.md`, and anything the user references for context relevant to `{{COUNCIL_FOCUS_AREAS}}` (30 seconds, not a research project). Reframe the raw question into a neutral prompt containing: the core decision, key context, what's at stake. Don't steer it. If it's too vague, ask one clarifying question, then proceed.

**Step 2 — Convene the council.** Spawn all 5 advisors simultaneously as sub-agents. Each gets its thinking style, the framed question, and: "Respond independently, 150-300 words, no hedging, no preamble. Lean fully into your angle — the other advisors cover what you don't."

**Step 3 — Peer review.** Collect all 5 responses, anonymize as Response A-E (randomize the mapping). Spawn 5 new sub-agents, each seeing all 5 anonymized responses, answering: (1) which response is strongest and why, (2) which has the biggest blind spot, (3) what did ALL of them miss. Under 200 words each, specific, reference by letter.

**Step 4 — Chairman synthesis.** One agent gets the original question, all 5 de-anonymized responses, and all 5 peer reviews. It produces:

```
## Where the Council Agrees
[Points multiple advisors converged on independently — high-confidence signals]

## Where the Council Clashes
[Genuine disagreements, both sides, why reasonable advisors differ]

## Blind Spots the Council Caught
[Things that only emerged through peer review]

## The Recommendation
[A clear, direct call — not "it depends." The chairman may side with a minority view if its reasoning is strongest, and should say why.]

## The One Thing to Do First
[A single concrete next step — not a list]
```

**Step 5 — Present in chat.** Show the full verdict directly in the conversation using the structure above. No HTML report, no dashboard, no files unless the user asks.

**Step 6 — Save transcript (optional).** Only if the user asks, or the decision is significant enough to reference later. Save to `{{TRANSCRIPT_LOCATION}}council-<topic>-<date>.md`.

## Important notes

- Always spawn all 5 advisors in parallel — sequential spawning wastes time and lets earlier answers bias later ones.
- Always anonymize for peer review, or reviewers defer to a perspective instead of judging on merit.
- The chairman can and should disagree with the majority when the minority's reasoning is stronger.
- Don't council trivial questions — if there's one right answer, just answer it.
