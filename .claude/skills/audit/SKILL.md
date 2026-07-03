---
name: audit
description: Use when the user says "audit the workspace", "how are we doing with this system", "check our setup", or runs /audit. Runs a "Four Cs" gap analysis of the CompanyOS itself, not of the business.
---

# audit

This skill audits the *workspace setup*, not the company. Be honest about gaps -- a flattering audit is a useless one.

## The Four Cs

1. **Context** -- Are `company/overview.md`, `voice.md`, and `icp.md` filled in, or still placeholder text? Check for leftover placeholder markers vs. real content. Note which files are still blank (`team.md` is optional -- flag it only if the user has mentioned teammates in other files).
2. **Connection** -- Is real email linked? Check whether email/calendar MCP tools are available in this session. If not, that's the single biggest gap: `/morning` and `/inbox-triage` are running blind. Point to the email step of `/onboard` or `docs/integrations/email.md`.
3. **Cadence** -- Are the daily/weekly habits happening? Check file dates: how recent is the newest file in `workspace/reports/` (weekly reviews) and the newest entry in `decisions/log.md`. Gaps of more than ~2 weeks are worth calling out plainly.
4. **Codification** -- Is `workflows/` growing? Count the SOPs there. Zero or one workflow months after onboarding suggests recurring work isn't getting documented.

## Output

Short and direct, in this order:

1. One or two lines per C: what's working, what's not.
2. **Honest gaps** -- a plain list of the real problems found, not softened.
3. **One recommended next action** -- a single concrete thing to do next (e.g. "run /sop-creator on your invoicing process" or "spend 10 minutes filling in company/icp.md"). Exactly one -- don't hand back a long to-do list.

If this is a brand-new workspace (no `.claude/.onboarded` marker), say that plainly and point to `/onboard` instead of running a full audit on an empty template.
