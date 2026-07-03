# DatasphereDynamics Company OS — Design v1

Date: 2026-07-03. Grounded in `docs/research/remote-research-2026-07-03.md` (12+ GitHub CompanyOS projects surveyed, official Claude Code docs, audit of datdyn2026 repos).

## Product shape

Two-part product:

1. **Template repo** (this repo, marked as a GitHub template) — the client forks/uses it; the repo IS the client's company. Everything a client needs ships project-level (`.claude/` in-repo) so `git clone` = install, zero extra steps.
2. **Plugin marketplace** (phase 2) — a `datdyn-companyos` plugin repo with `marketplace.json` for versioned skill updates across clients (`/plugin marketplace add`). Don't build until ≥2 clients need centralized updates.

Rationale: every surveyed template (company-os-starter-kit, business-os, AIS-OS, ceos, carls-product-os, dswh/company-os) keeps company skills **project-level**; only methodology frameworks (superpowers, compound-engineering, claude-ops) distribute globally via plugin. De facto rule: methodology → global plugin; company knowledge + business skills → in-repo.

## Folder structure (the convergent 4-layer grammar)

```
CompanyOS/
├── CLAUDE.md                  # thin router: who/what/where table, <60 lines; points at everything
├── GOALS.md                   # current quarter goals — the "why" Claude reads every session
├── company/                   # LAYER 2: context/memory (the brain)
│   ├── overview.md            # what the business is, model, stage
│   ├── team.md                # people, roles, who-asks-for-what
│   ├── voice.md               # brand voice + writing samples
│   └── icp.md                 # ideal customer profile
├── decisions/
│   └── log.md                 # append-only decision log (date, decision, why)
├── workflows/                 # repeatable processes (SOPs) — one .md per workflow
├── projects/                  # one-off initiatives, one folder per project
├── workspace/                 # generated outputs (drafts, briefs, reports)
├── archive/                   # completed projects/quarters
├── docs/                      # this design, research, client-facing guide
└── .claude/
    ├── settings.json          # hooks config, permissions
    ├── skills/
    │   ├── onboard/SKILL.md   # THE onboarding interview (flagship)
    │   ├── morning/SKILL.md   # daily briefing
    │   ├── inbox-triage/SKILL.md
    │   ├── write-in-voice/SKILL.md
    │   ├── sop-creator/SKILL.md
    │   ├── decision-log/SKILL.md
    │   ├── weekly-review/SKILL.md
    │   └── audit/SKILL.md     # "Four Cs" gap analysis (from AIS-OS pattern)
    ├── agents/                # (v1: none or 1-2; add when a skill needs isolation)
    └── hooks/
        ├── session-start.sh   # onboarding check + context loader
        └── safety-guard.sh    # PreToolUse: block destructive commands
```

BLANK + EXAMPLE dual template (Carl's Product OS pattern): every `company/*.md` file ships with HTML-comment placeholders AND an `examples/acme/` filled reference so nontechnical users see what "done" looks like.

## Onboarding skill (`/onboard`) — the flagship

Pattern: interview-then-generate-files (the established convention — AIS-OS `/onboard`, claude-ops `/ops:setup`, dswh `INSTALL_FOR_AGENTS.md`).

Mechanics:
- `SessionStart` hook checks for `.claude/.onboarded` marker; if absent, injects: "This workspace isn't set up yet — say 'onboard me' or run /onboard."
- Skill runs a 5-step wizard (15 min, AskUserQuestion chips for choice steps): business + model, top 3 goals, voice samples (paste 2-3 things you wrote), connect real email (Gmail/Outlook 365 via Composio MCP — see `docs/integrations/email.md`), biggest time sink. (v1.1: dropped the team and tools questions; team.md stays as an optional placeholder.)
- Generates: `company/overview.md` + `voice.md`, `GOALS.md`, personalizes `CLAUDE.md` header, seeds `workflows/` with 1 SOP from the "biggest time sink" answer, writes `.claude/.onboarded`.
- Ends by teaching the 3 daily commands: `/morning`, `/inbox-triage` (real email), `/weekly-review`. (v1.1: the local `inbox/` folder and `company/connections.md` registry were removed — skills read the connected mailbox and detect available MCP tools at runtime.)

## Messaging / IM strategy

- **Slack**: the official Claude Code Slack integration is the primary nontechnical path (@Claude in channel → cloud session → progress + PR buttons posted back). Requires repo on GitHub. Document this in the client guide.
- **Teams**: no official integration exists (absent from every surveyed project too). Path: Microsoft 365 MCP connector for reading Teams/Outlook data inside sessions; a true in-Teams chat bot = custom Agent SDK build (sellable add-on, not template scope).
- **Telegram/Discord**: Claude Code channels (research preview) or a bot; Telegram is the ecosystem's pragmatic favorite. Phase 2.

## OneDrive / Google Drive

**Do not put the repo (or any git repo) in a OneDrive/Google Drive/Dropbox sync folder** — file locking, sync delays, and `.git` corruption. The nontechnical-friendly answer is: repo lives on GitHub; clients use Claude Code on the web / Slack integration (no local files at all), or GitHub Desktop + local disk. Drive/OneDrive files are reachable as *data* via MCP connectors — that's the integration clients actually want.

## Token optimization (design-in, not bolt-on)

- Thin `CLAUDE.md` router (<60 lines); all detail lives in skills, loaded on demand.
- Skills over CLAUDE.md content; subagents for high-volume work; `# Compact instructions` section preserving GOALS.md + today's decisions.
- Native features already cover most needs (deferred MCP tool search, prompt caching, auto-compaction). Do NOT ship context-mode/token-optimizer MCPs to clients — extra moving parts, marginal gain on a thin repo.
- Vendor-side (you): keep superpowers + context-mode global on your machine; they never ship in the template.

## Hooks shipped (project-level, `.claude/settings.json`)

1. `SessionStart` — onboarded check + load GOALS.md reminder (the onboarding trigger).
2. `PreToolUse` safety guard — block `rm -rf`, force-push, `.env` reads (nontechnical users can't assess these).
3. (Optional) session logger → `workspace/logs/` JSONL.

## Global vs project — final placement table

| Component | Level | Why |
|---|---|---|
| EA/business skills (morning, triage, voice, SOP) | **Project** | Repo is the product; clone = install; git pull = update |
| Onboarding skill + hooks | **Project** | Must work on first clone |
| Methodology (superpowers, compound-engineering) | **Global (vendor only)** | Your tooling, not the client's |
| Future: versioned skill updates | **Plugin marketplace** | Phase 2, when multiple clients |

## Phase plan

- **v1 (build now):** folder structure + BLANK/EXAMPLE files + 8 skills + 2 hooks + client-facing README + Slack setup guide.
- **v1.1:** mark repo as GitHub template; test full onboarding with a fake client.
- **v2:** plugin marketplace for updates; Telegram channel; per-vertical skill packs.
