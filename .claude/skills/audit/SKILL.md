---
name: audit
description: Use when the user says "audit the workspace", "how are we doing with this system", "check our setup", or runs /audit. Runs a "Four Cs" gap analysis of the CompanyOS itself, not of the business.
---

# audit

This skill audits the *workspace setup*, not the company. Be honest about gaps -- a flattering audit is a useless one.

## The Four Cs

1. **Context** -- Are `company/overview.md`, `team.md`, `voice.md`, `icp.md`, and `connections.md` filled in, or still placeholder text? Check for leftover placeholder markers vs. real content. Note which files are still blank.
2. **Capture** -- Is `inbox/` actually being used? Look at how many items are sitting there, and roughly how old the oldest unprocessed one is. An empty inbox that's never had anything in it is a different problem (nobody's using the habit) than a backlog of 40 stale items (capture works, triage doesn't).
3. **Cadence** -- Are the daily/weekly habits happening? Check file dates: how recent is the newest file in `workspace/reports/` (weekly reviews) and the newest entry in `decisions/log.md`. Gaps of more than ~2 weeks are worth calling out plainly.
4. **Codification** -- Is `workflows/` growing? Count the SOPs there. Zero or one workflow months after onboarding suggests recurring work isn't getting documented.

## Output

Short and direct, in this order:

1. One or two lines per C: what's working, what's not.
2. **Honest gaps** -- a plain list of the real problems found, not softened.
3. **One recommended next action** -- a single concrete thing to do next (e.g. "run /sop-creator on your invoicing process" or "spend 10 minutes filling in company/icp.md"). Exactly one -- don't hand back a long to-do list.

If this is a brand-new workspace (no `.claude/.onboarded` marker), say that plainly and point to `/onboard` instead of running a full audit on an empty template.
