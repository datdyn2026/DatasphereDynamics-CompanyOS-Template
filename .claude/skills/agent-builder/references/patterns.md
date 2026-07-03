# Agent Builder — Memory & Credential Patterns

Deeper reference for the agent-builder skill. Read this when setting up a new agent's memory or credentials, or when auditing an existing one.

## Memory pattern catalog

Pick whichever pattern matches what the agent needs to remember. Simple agents often need none of these; skip memory entirely if there's nothing worth persisting.

### 1. Incremental refinement
**Best for:** style, voice, or preferences that evolve through corrections.
- Agent reads its consolidated profile + refinements log before generating anything.
- User corrects something during the work.
- Agent appends the correction to `[name]-refinements.md`: date, type, what changed, why.
- Periodically (or on request), the agent recompiles a consolidated profile from all refinements.

| Date | Type | What Changed | Why |
|------|------|--------------|-----|
| 2026-03-31 | email tone | Changed "Just checking in" to "Following up" | User preference |

### 2. Decision tracking & escalation
**Best for:** configuration or policy decisions that recur (asset management, approvals).
- Agent logs each decision (date, category, decision, context) to a decisions log.
- After the same kind of decision repeats 3+ times, promote it to `MEMORY.md` as a standing preference.
- Future requests apply the promoted preference proactively instead of asking again.

### 3. Usage tracking & promotion
**Best for:** learning defaults and favorites from repeated requests.
- Log each request for a specific resource.
- After 3+ requests for the same thing, promote it to a default in `MEMORY.md`.

### 4. Session state
**Best for:** long-running, multi-session projects.
- Update `MEMORY.md` after each session: last session's summary, open items, current state, key decisions.
- At the start of a new session, read `MEMORY.md` first to resume context.

### 5. Schema learning
**Best for:** integrations where structure (fields, IDs, quirks) is discovered at runtime rather than known up front.
- On first use, the agent discovers the relevant structure and caches it in `MEMORY.md` (field names, IDs, any workarounds needed).
- Later runs reuse the cached structure instead of rediscovering it each time; re-discover only if something errors out.

**Common file layout:**
- `MEMORY.md` — the index: learned preferences, promoted defaults, current state.
- `[name]-refinements.md` or `[name]-decisions.md` — the append-only log feeding into `MEMORY.md`.
- `samples/` — optional reference examples, only if the agent benefits from concrete past examples.

## Credential storage tiers

Pick based on where the agent actually runs. Whatever tier is chosen, the rule is the same: **never write a real credential value into an agent file, a memory file, or anything committed to git.**

### Tier 1 — Local credential manager (single user, one machine)
Use the operating system's own credential/keyring service. Store the secret through it once; agents and scripts retrieve it at runtime rather than reading a plaintext file. Good default for a solo operator working on their own laptop.

### Tier 2 — Environment file (`.env`, gitignored)
Simple and portable — works in containers, CI, and most hosting setups.
- Real values go in `.env` (gitignored, never committed).
- A parallel `.env.example` with placeholder values ships in git so the shape is documented.
- Confirm `.gitignore` actually excludes `.env*` except the `.example` file.

### Tier 3 — Team secrets manager
For multi-person teams or production systems: a centralized secrets service with access control and audit history, so nobody needs a copy of the raw credential on their own machine. Reach for this once more than one person needs access to the same credential.

This company's default: `{{SECRET_STORAGE_METHOD}}`.

## Security checklist

Run through this for every agent that touches an external API or handles sensitive data.

**Credentials**
- [ ] No API keys, tokens, or secrets in the agent `.md` file
- [ ] No secrets in `.claude/agent-memory/` files
- [ ] No secrets in any file committed to git
- [ ] Credential storage matches one of the tiers above, never plaintext in source
- [ ] Error messages confirm a credential exists without ever printing its value

**API usage**
- [ ] Least-privilege scopes — only what the agent actually needs
- [ ] Rate limiting considered (avoid accidental cost or quota spikes)
- [ ] Error handling for: service down, invalid credential, rate limited, network failure
- [ ] Timeouts set on any HTTP call
- [ ] Responses validated, not blindly trusted

**Boundaries**
- [ ] `Rules` section has explicit never-items for safety-critical behavior
- [ ] Scope gates redirect out-of-scope requests to the right place
- [ ] Bash restricted to read-only where possible
- [ ] Sensitive-data handling rules defined (PII, financial data, etc.)
- [ ] The agent cannot alter its own definition or escalate its own permissions

**Memory**
- [ ] Memory files contain no secrets or credentials
- [ ] Memory files contain no PII beyond what the agent's purpose actually requires
- [ ] Logs use paths relative to the project, not machine-specific absolute paths
- [ ] All memory lives under `.claude/agent-memory/[name]/` — nowhere scattered
