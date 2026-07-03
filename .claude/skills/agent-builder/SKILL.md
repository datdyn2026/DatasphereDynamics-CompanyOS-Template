---
name: agent-builder
description: "Use when creating new agents, optimizing existing agents, or auditing agent quality. Guides agent development with security due diligence, memory setup, and credential management. Triggers: create agent, build agent, new agent, agent builder, scaffold agent, validate agent."
---

## First-use setup (Claude: complete this, then delete this entire section)

This skill has not yet been adapted to this company. Before running it the first time:
1. Read company/overview.md and any other company/ files relevant to this skill (if empty, ask the user to run /onboard first).
2. Ask the user:
   - What recurring, delegable work exists at this company that a dedicated agent could own (e.g. weekly reporting, customer-support triage, invoice processing)? → fills `{{RECURRING_DELEGATABLE_WORK}}`
   - How does this company store credentials/secrets today — a password manager, an OS-level keyring, gitignored `.env` files, or a team secrets vault? → fills `{{SECRET_STORAGE_METHOD}}`
   - Who reviews a new agent before it's trusted with real work? → fills `{{AGENT_REVIEW_OWNER}}`
   - Default model tier for new agents — sonnet (balanced default), opus (complex judgment calls), or haiku (fast/cheap, high volume)? → fills `{{DEFAULT_MODEL_TIER}}`
3. Edit THIS file (`.claude/skills/agent-builder/SKILL.md`): replace every `{{PLACEHOLDER}}` with the real answers, adjust defaults to fit this company, then DELETE this entire "First-use setup" section.
4. Confirm to the user what was adapted, then proceed with their original request.

The presence of this section means the skill is uninitialized; its absence means initialized.

---

## What this skill does

Guides building and auditing Claude Code agents — specialized subagents with their own tools, memory, and workflow, defined in `.claude/agents/[name].md` and auto-discovered by Claude Code. Use it to build a new agent, audit an existing one, or optimize one that's already running.

**Agents vs. skills:** an agent is a persona with persistent memory, invoked by natural language or delegation. A skill is a static, stateless SOP invoked the same way every time. Build an agent when the work needs to remember things across sessions and improve over time; build a skill (see the skill-builder skill) when it doesn't.

## Mode 1: Build a new agent

### Discovery interview

Ask one topic at a time (don't dump all of this in one message), moving on only after an answer:

- **Purpose & name** — what does it do, what problem does it solve, what should it be called (kebab-case, matches its filename)? Model tier defaults to `{{DEFAULT_MODEL_TIER}}` unless this agent needs something else.
- **Triggers & scope** — 3-5 phrases that should invoke it; what should it explicitly NOT handle (redirect those elsewhere)?
- **Tools** — which built-in tools (Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch) does it actually need? Default to no extra MCP servers unless the user explicitly asks for one. If it needs Bash, is that read-only (inspection) or read-write (it changes things)?
- **Credentials** — does it call any external service? For each: service name and what kind of credential. Store it via `{{SECRET_STORAGE_METHOD}}` — never hardcoded anywhere.
- **Workflow steps** — walk through invocation to output, step by step. Conversational or autonomous? What does it hand back, and in what format?
- **Guardrails** — what should it never do? What happens when an API is down, input is malformed, or data is missing? Any sensitive-data rules (PII, financial data)?
- **Memory** — what should it remember between sessions, if anything? Pick a pattern from `references/patterns.md` that fits.

Skip any topic the user already answered upfront — don't re-ask what you already know.

### Confirm before building

Summarize purpose, model, triggers, scope gates, tools, credentials, workflow steps, guardrails, and memory plan in one block. Ask "Does this capture it — anything to add or change?" Only build after they confirm.

### Quick research

Before writing the file: check `.claude/agents/` for a similar existing agent to extend instead of duplicating. If it calls an external API, look up that API's rate limits and the minimum permission scope it actually needs.

### Security due diligence

Complete before building any agent with external access:
- [ ] Credential storage method decided (`{{SECRET_STORAGE_METHOD}}`) — never hardcoded in the agent file or its memory
- [ ] Least-privilege scopes chosen for any API access
- [ ] Error handling defined for: missing credential, API down, bad input
- [ ] Sensitive-data handling rules defined, if applicable

### Write the agent file

`.claude/agents/[name].md`:

```markdown
---
name: [kebab-case-name]
description: "[What it does. 3-5 trigger phrases. NOT-for gates.]"
tools: [comma-separated list]
model: [sonnet/opus/haiku/inherit]
---

[1-2 sentence role definition: "You are the [name] agent. Your job is to..."]

## Scope
[Hard exclusions and redirects to other agents, if relevant]

## Step 1: [...]
[Detailed instructions]

## Step N: Update memory
[What to log, and where — see Agent Memory below]

## Rules
- [Never-rules: hard, non-overridable boundaries]

## Agent Memory
Update with: [what to track]
Location: `.claude/agent-memory/[name]/`
```

### Set up memory

Create `.claude/agent-memory/[name]/MEMORY.md` (starts empty, fills in over time) plus a refinements log. Choose the matching pattern from `references/patterns.md`.

### Register credentials

Store per `{{SECRET_STORAGE_METHOD}}`. Never write a real credential value into the agent file, a memory file, or anything committed to git. See `references/patterns.md` for setup guidance per storage method.

### Test it

- **Trigger test** — try the 3-5 phrases from the interview.
- **Memory check** — confirm the expected files exist under `.claude/agent-memory/[name]/`.
- **Happy path** — run the primary workflow with realistic input.
- **Edge cases** — missing credential, empty input, out-of-scope request. Each should fail gracefully or redirect, never silently do the wrong thing.

## Mode 2: Audit an existing agent

Read the agent file in full first, then check:
- **Frontmatter** — name matches the filename, description has real trigger phrases and NOT-for gates, tools list is minimal, model tier is appropriate.
- **Content** — clear role definition, scope gates where relevant, specific (not vague) steps, stated output format, a memory-update step.
- **Security** — no hardcoded secrets anywhere, credential storage method documented, Bash restricted appropriately, sensitive-data rules present if relevant.
- **Memory** — memory directory exists, `MEMORY.md` has real structure, the feedback loop has a clear promotion rule (see `references/patterns.md`).

Fix anything you find before calling the audit complete.

## Mode 3: Optimize an existing agent

Run the Mode 2 audit first. Then ask: is its memory actually gaining content across uses (if not, the memory instructions are probably too vague)? Can any tool be dropped without breaking it? Did it do anything unexpected recently that deserves a new guardrail?

## Important notes

- Never propose changes to an agent you haven't read in full.
- Check for a similar existing agent before building a new one.
- Never hardcode secrets in an agent definition, memory file, or any generated artifact.
- Prefer direct API calls (scripts/Bash) over adding a new MCP server; only add one if the user explicitly asks.
- New agents go through `{{AGENT_REVIEW_OWNER}}` before they're trusted with real work.
- For the full memory-pattern catalog, credential storage setup, and security checklist, see `references/patterns.md`.
