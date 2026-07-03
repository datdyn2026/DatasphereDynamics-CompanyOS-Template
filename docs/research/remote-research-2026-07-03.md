<!-- Recovered from remote ultraplan session 2026-07-03 (session_01UePqJRLwsy5oa5CCF7jAgb) -->

# Part 1 — Audit: datdyn2026 repos (template + prior art)

All research is complete. Here are the raw findings.

# Research Findings: datdyn2026/DatasphereDynamics-CompanyOS-Template

## 1. Repo accessibility and file tree

**The repository exists and is public, but it is COMPLETELY EMPTY — zero commits, zero branches, zero files.**

Evidence (GitHub API, `https://api.github.com/repos/datdyn2026/DatasphereDynamics-CompanyOS-Template`):
- `private: false`, `visibility: public`, `fork: false`, `is_template: false`
- `description: null`, `language: null`, `topics: []`, `license: null`
- `size: 0` KB
- `created_at` / `updated_at` / `pushed_at` all identical: **2026-07-03T15:59:44Z** (created today, never pushed to)
- `default_branch: main` (nominal only — no branch actually exists)

Confirmations of emptiness:
- `/git/trees/main?recursive=1` → **HTTP 409 Conflict** (GitHub's response for "Git Repository is empty")
- `/contents/` → **HTTP 404**
- `/branches` → `[]` (empty array)
- Web UI (`https://github.com/datdyn2026/...`) → displays the literal message **"This repository is empty."** with no files, README, branches, or commits.

**File tree: none — there are no files at all.** Consequently there is no README, no CLAUDE.md, no `.claude/` directory, no skills, agents, hooks, or settings.json in this repo.

## 2. Design decisions already made in the target repo

None, beyond what the repo name itself implies:
- Name: `DatasphereDynamics-CompanyOS-Template` — suggests intent to build a "Company OS" template for an org called "Datasphere Dynamics"
- Default branch will be `main`
- Public visibility, no license chosen, not yet marked as a GitHub template repo

There is zero onboarding material, folder structure, or naming convention committed anywhere in it.

## 3. Related repo found: `datdyn2026/claude-skills-demo`

The user has exactly **2 public repos**. The other one is relevant as prior art:

- **Name:** `claude-skills-demo`
- **Description:** "Ready-to-use Claude Code skills for programmatic & AI video generation: Remotion, HeyGen HyperFrames, kie.ai"
- **Default branch:** `master`, created 2026-06-01, not a fork, no license field set (README says MIT)

**Full file tree** (from `/git/trees/master?recursive=1`, not truncated):
```
.claude/
.claude/skills/
.claude/skills/hyperframe/SKILL.md
.claude/skills/kie-ai/SKILL.md
.claude/skills/remotion/SKILL.md
.env.example
.gitignore
CLAUDE.md
README.md
```

**CLAUDE.md** (verbatim, key content): a self-described "generic starter template" with sections `## Project overview`, `## Available skills` (table mapping skill name → "Use when"), `## Conventions`, `## Notes`. Notable conventions:
- Secrets: never hardcode/commit API keys; use env vars (`process.env.KIE_API_KEY`), git-ignored `.env`, committed `.env.example` with placeholders
- Node.js 22+ target
- "Commits: small, focused commits with clear messages. Don't commit generated output (`out/`, `*.mp4`) or `node_modules/`."
- Contains HTML-comment placeholders like `<!-- One or two sentences: what this project is... -->` — i.e., it's deliberately built as a reusable template

**README.md**: documents the layout ("CLAUDE.md — Project instructions Claude reads on start", `.claude/skills/<name>/SKILL.md`), a skills table, and usage: clone → open with Claude Code → "Skills under `.claude/skills/` are auto-discovered; Claude loads a skill when your task matches its description." MIT licensed.

**Skill frontmatter** (all three follow the standard `name:` + trigger-phrased `description:` pattern):
```yaml
name: remotion
description: Use when creating or editing videos programmatically with React and Remotion — defining compositions, animating with frames, or rendering/previewing MP4s from code.
```
```yaml
name: hyperframe
description: Use when generating MP4 video from HTML/CSS/JS compositions with HeyGen HyperFrames — scaffolding, previewing, or rendering "video as code" with GSAP/Lottie/CSS animations.
```
```yaml
name: kie-ai
description: Use when generating images, video, or music through the kie.ai unified AI API — calling Veo, Flux, Nano Banana, GPT Image, Suno, Runway, etc., handling auth, and polling async tasks.
```

Established design patterns in this prior repo that would carry over to a new template:
- One directory per skill: `.claude/skills/<kebab-case-name>/SKILL.md`
- Skills as self-contained, on-demand references ("Each is a self-contained reference Claude loads on demand when the task matches its description")
- CLAUDE.md kept short with a skill-routing table rather than inlining skill content
- `.env.example` + `.gitignore` secret hygiene
- No agents, no hooks, no commands, no `settings.json` anywhere — only skills

## 4. "Token optimization", "context", "superpowers"

- **Target repo:** nothing (empty repo).
- **claude-skills-demo:** no occurrences of "token optimization" or "superpowers" in CLAUDE.md, README.md, or any SKILL.md. The closest related concept is the implicit context-economy pattern: skills are loaded on demand ("self-contained reference Claude loads on demand when the task matches its description") instead of stuffing everything into CLAUDE.md. There is no obsidian/superpowers-style plugin, no hooks, no context-management tooling.

## Bottom line

`DatasphereDynamics-CompanyOS-Template` is a blank slate created today (2026-07-03T15:59:44Z) with no commits whatsoever — everything (README, CLAUDE.md, `.claude/` structure, licenses, topics, template flag) is yet to be decided. The only prior art from this account is `claude-skills-demo`, which establishes a minimal, skill-centric Claude Code repo convention (`CLAUDE.md` router + `.claude/skills/<name>/SKILL.md`, env-var secret hygiene, Node 22+) and contains no token-optimization, context-management, or "superpowers" material.

---

# Part 2 — Claude Code architecture (scoping, plugins, OneDrive/Drive, Slack/Teams, onboarding, token optimization)

Now I have comprehensive information. Let me provide you with authoritative, fully-cited answers to each question:

---

## Structured Answers to Your Claude Code Questions

### 1. GLOBAL vs PROJECT SCOPING: ~/.claude vs .claude/ Hierarchy and Distribution

**Summary**: Global (`~/.claude/`) and project (`.claude/`) configurations form a precedence hierarchy where project-level settings override global ones. Projects can ship skills, agents, hooks, CLAUDE.md, and MCP servers that load automatically with zero install steps via git checkout.

**Details**:

**Skills** live in multiple scopes and load based on discovery:
- **User-level**: `~/.claude/skills/`  
- **Project-level**: `./.claude/skills/` or individual skill files  
- **Plugin-level**: Distributed within plugins  
Skills in `.claude/` are auto-discovered and load when invoked or when Claude determines they're relevant. No explicit configuration needed.
[https://code.claude.com/docs/en/skills.md](https://code.claude.com/docs/en/skills.md)

**Memory (CLAUDE.md)** has explicit precedence:
| Scope | Location | Loaded |
|-------|----------|--------|
| Managed policy | `/etc/claude-code/CLAUDE.md` (Linux) | Always, cannot be excluded |
| User instructions | `~/.claude/CLAUDE.md` | Every session |
| Project instructions | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Every session |
| Local instructions | `./CLAUDE.local.md` | Session (gitignored) |

Project CLAUDE.md is loaded after user-level, so project instructions take precedence in conversation context. Rules can be organized in `.claude/rules/` with path-specific scoping.
[https://code.claude.com/docs/en/memory.md#choose-where-to-put-claude-md-files](https://code.claude.com/docs/en/memory.md#choose-where-to-put-claude-md-files)

**Subagents (Custom Agents)** can be shipped at project level:
- **Project agents**: `./.claude/agents/<name>/agent.md` are auto-discovered  
- **User agents**: `~/.claude/agents/` for personal reuse across projects  
Agents defined at project level override same-named user-level agents. An `AGENTS.md` file can coexist with `CLAUDE.md` via imports.
[https://code.claude.com/docs/en/sub-agents.md#quickstart-create-your-first-subagent](https://code.claude.com/docs/en/sub-agents.md#quickstart-create-your-first-subagent)

**Hooks** have a scope hierarchy:
- **User scope**: `~/.claude/` settings  
- **Project scope**: `./.claude/settings.json`  
Hooks in `.claude/settings.json` override user-level hooks. Both fire unless filtered by matchers.
[https://code.claude.com/docs/en/hooks-guide.md#configure-hook-location](https://code.claude.com/docs/en/hooks-guide.md#configure-hook-location)

**MCP Servers** follow a clear precedence:
1. Local scope (`.mcp.json` in project root)  
2. Project scope (`./.claude/.mcp.json`)  
3. User scope (`~/.claude/.mcp.json`)  
Project-level MCP servers override user-level ones by name.
[https://code.claude.com/docs/en/mcp.md#mcp-installation-scopes](https://code.claude.com/docs/en/mcp.md#mcp-installation-scopes)

**Distribution via Plugins & Marketplaces**:

The recommended way to distribute a bundle of skills, agents, hooks, and MCP servers is via **plugins and marketplaces**. A plugin is a self-contained directory with:
- `.claude-plugin/plugin.json` (manifest)  
- `skills/`, `agents/`, `hooks/`, `.mcp.json`, `settings.json`

Once packaged, plugins are distributed through **plugin marketplaces** (git repositories with a `marketplace.json` catalog). Users add the marketplace with `/plugin marketplace add <url>` and install individual plugins. This is the **recommended pattern for nontechnical clients**—they clone a repo with a marketplace configuration, run Claude Code once, and all plugins install automatically.

Marketplaces support:
- **Git repositories** (GitHub, GitLab, local paths)  
- **Version management** (git commit SHA or explicit `version` field)  
- **Auto-updates** (users run `/plugin marketplace update`)  
- **Managed marketplace restrictions** for enterprise deployments

There is no `.claude-plugin/marketplace.json` standard; instead, create a `marketplace.json` at the repo root listing plugins and their sources.
[https://code.claude.com/docs/en/plugin-marketplaces.md](https://code.claude.com/docs/en/plugin-marketplaces.md)

---

### 2. "Company OS" for Nontechnical Clients: Skill Placement and Tradeoffs

**Recommendation**: For executive-assistant-type skills (email triage, calendar, meeting notes, weekly reports), **ship them at the project level** (`./.claude/skills/`) rather than global. For "Company OS" deployments, bundle skills + agents + hooks in a plugin distributed via a marketplace.

**Reasoning**:

| Approach | Portability | Updates | Multiple Projects | Team Alignment |
|----------|-------------|---------|-------------------|---|
| **Global (~/.claude/)** | Skills stay even if you switch projects | Requires manual updates per machine | Reused everywhere | Risk: divergent configs across team |
| **Project (./.claude/)** | Skills ship with repo via git | Controlled via git commits; all team members auto-update on pull | Separate per project | Consistency: repo is source of truth |
| **Plugin (marketplace)** | Versioned; users install once | Marketplace update flow; governance possible | Installed once, used everywhere | Best: explicit versioning, audit trail |

**For nontechnical clients**, the plugin + marketplace pattern is ideal:
1. Create a `company-os-skills` plugin with `skills/`, `agents/`, `hooks/`  
2. Add a `settings.json` to set defaults (model, permission mode, effort level)  
3. Host in a git repo with `marketplace.json`  
4. Clients add marketplace once: `/plugin marketplace add https://github.com/your-org/company-os`  
5. All skills auto-install; updates flow through `/plugin marketplace update`

This avoids manual distribution; users never touch `.claude/` directly.
[https://code.claude.com/docs/en/plugins.md#when-to-use-plugins-vs-standalone-configuration](https://code.claude.com/docs/en/plugins.md#when-to-use-plugins-vs-standalone-configuration)

---

### 3. Claude Code in OneDrive / Google Drive: Known Issues and Patterns

**Status**: Claude Code **does not officially document support for running in OneDrive, Google Drive, or Dropbox sync folders**. The documentation does not mention cloud sync folder compatibility or known issues with file locking, git corruption, or symlinks.

However, integration with OneDrive and Google Drive via MCP is supported for **reading/writing files through API calls**, not for hosting the git repository itself:

**OneDrive**: Full MCP integration available through Composio and others, allowing Claude to upload, download, move, and share files programmatically.

**Google Drive**: Multiple integration methods (native connector, Zapier/automation, semantic search via Context Link) allow Claude to interact with Drive files, but running a git repo directly in a Drive sync folder is not an official pattern.

**For nontechnical users wanting synced files**, the documented patterns are:
1. **Claude Code on the web** (https://code.claude.com/docs/en/claude-code-on-the-web): Sessions run in Anthropic's cloud; GitHub is source of truth; no local sync needed.  
2. **Git + GitHub as source of truth**: Keep repo on local disk (not in sync folder); use GitHub Desktop or `git` CLI for sync.  
3. **Remote Control**: Control a local session from another device via https://code.claude.com/docs/en/remote-control.

**Not recommended**: Placing `.git` directories in OneDrive, Google Drive, or Dropbox due to potential file-locking conflicts, sync delays, and corruption risks (these are known issues with git in cloud-synced folders generally, not Claude Code–specific).
[https://code.claude.com/docs/en/platforms.md#where-to-run-claude-code](https://code.claude.com/docs/en/platforms.md#where-to-run-claude-code)

---

### 4. Official Integrations with Slack, Teams, and IM Apps in 2026

**Slack**:  
Claude Code has a dedicated Slack integration that automatically routes coding requests to Claude Code sessions on the web. When you mention `@Claude` in a channel (in "Code + Chat" mode), Claude routes coding tasks to Claude Code on the web, creating a session and posting progress updates back to Slack.

Features:
- **Context gathering**: Reads thread history for context  
- **Automatic routing**: Detects coding intent or use explicit "as Code" retry  
- **Session summary + buttons**: "View Session", "Create PR", "Change Repo"  
- **Session sharing**: Enterprise and Team accounts see sessions in org history  
- **Limitations**: GitHub only; sessions count against individual user's plan limits

Setup: Install from Slack App Marketplace; connect Claude account in App Home; choose routing mode (Code only vs Code + Chat).
[https://code.claude.com/docs/en/slack.md](https://code.claude.com/docs/en/slack.md)

**Microsoft Teams**:  
There is **no official Claude Code integration for Teams** documented in the Claude Code docs. However, Microsoft 365 connector and third-party MCP integrations (via Composio and others) allow Claude to read/write Teams data through API calls, but this is **not an in-app chat experience**—it's MCP tool access.

For the realistic path: use **Claude Tag** (launched as the new Teams integration), which runs as an organization-managed `@Claude` identity in Slack with admin-configured access under the same Slack app. If you need Teams-specific chat experiences, you would build custom integrations via MCP connectors or the Agent SDK.
[https://code.claude.com/docs/en/slack.md#note](https://code.claude.com/docs/en/slack.md#note) mentions migration from earlier Claude in Slack to Claude Tag.

**Other IM Apps**:  
Claude Code supports **channels** (research preview), which allow push messages from Telegram, Discord, or custom webhooks to trigger sessions. This is different from a full chat interface—events are sent to a running session, and Claude reacts.
[https://code.claude.com/docs/en/channels.md](https://code.claude.com/docs/en/channels.md)

**For nontechnical teams**: The Slack integration is the primary official path in 2026. Teams users would need to migrate to Slack or use the MCP-based approach. For other platforms (Discord, Telegram), use channels or build custom MCP servers.

---

### 5. Onboarding Patterns: Configuring Workspaces Interactively

**Pattern**: Use a **SessionStart hook** combined with a custom **onboarding subagent** to interview new users and configure the workspace. This is achievable with standard Claude Code primitives.

**Implementation**:

1. **SessionStart Hook**: Fires automatically at session start. You can inject a prompt that asks: "Is this your first time? Let me configure your workspace."
   ```json
   {
     "hooks": {
       "SessionStart": [
         {
           "type": "prompt",
           "prompt": "If this is the user's first session, ask them: name, project type, preferred model, output style. Use /setup-workspace skill to apply their choices."
         }
       ]
     }
   }
   ```
   Or use a command hook to run a shell script that checks for a `.claude/.onboarded` marker file.
   [https://code.claude.com/docs/en/hooks-guide.md#set-up-your-first-hook](https://code.claude.com/docs/en/hooks-guide.md#set-up-your-first-hook)

2. **Onboarding Skill**: Create `./.claude/skills/setup-workspace/SKILL.md` that:
   - Interviews the user (via conversation)  
   - Writes a `.claude/settings.local.json` with their choices  
   - Optionally creates a CLAUDE.local.md with personal preferences  
   [https://code.claude.com/docs/en/skills.md](https://code.claude.com/docs/en/skills.md)

3. **Onboarding Subagent** (optional, for more sophisticated flows): Define `./.claude/agents/onboarding/agent.md` that runs only once, guides the user through setup, and marks completion.
   [https://code.claude.com/docs/en/sub-agents.md#configure-subagents](https://code.claude.com/docs/en/sub-agents.md#configure-subagents)

4. **Avoid Prompting Repeatedly**: Use a `SessionStart` hook to check if `.claude/.onboarded` exists. If yes, skip the onboarding agent. If no, spawn it.

**Established patterns in the wild**: The `/init` command auto-generates CLAUDE.md, skills, and hooks for a project. You can extend this with an onboarding flow. No single "onboarding framework" exists in the docs, but the hooks + skills + subagents primitives enable it.

---

### 6. Token / Context Optimization: Built-in Features and Common Practices

**Built-in Features**:

| Feature | What it does | Doc |
|---------|-------------|-----|
| **Auto-compaction** | Summarizes conversation history when context nears limit; preserves root CLAUDE.md | [https://code.claude.com/docs/en/context-window.md](https://code.claude.com/docs/en/context-window.md) |
| **Prompt caching** | Caches system prompt, CLAUDE.md, MCP tool names; reduces cost for repeated content | [https://code.claude.com/docs/en/prompt-caching.md](https://code.claude.com/docs/en/prompt-caching.md) |
| **MCP tool search (deferred)** | Tool schemas loaded on-demand, not upfront; only tool names in context by default | [https://code.claude.com/docs/en/mcp.md#scale-with-mcp-tool-search](https://code.claude.com/docs/en/mcp.md#scale-with-mcp-tool-search) |
| **Context visualization** | `/context` command shows what's loaded and token cost per component | [https://code.claude.com/docs/en/context-window.md](https://code.claude.com/docs/en/context-window.md) |
| **Custom compaction instructions** | `# Compact instructions` section in CLAUDE.md tells Claude what to preserve during auto-compaction | [https://code.claude.com/docs/en/costs.md#manage-context-proactively](https://code.claude.com/docs/en/costs.md#manage-context-proactively) |
| **Subagents** | Delegate high-volume work (tests, logs, research) to a separate context window; only summary returns | [https://code.claude.com/docs/en/sub-agents.md#isolate-high-volume-operations](https://code.claude.com/docs/en/sub-agents.md#isolate-high-volume-operations) |
| **Skills as token savers** | Move detailed instructions from CLAUDE.md to skills; skills load on-demand only | [https://code.claude.com/docs/en/costs.md#move-instructions-from-claude-md-to-skills](https://code.claude.com/docs/en/costs.md#move-instructions-from-claude-md-to-skills) |

**Common Practices**:

| Pattern | Benefit | Doc |
|---------|---------|-----|
| **Preprocessing hooks** | Hook can grep logs for `ERROR` lines only, reducing 10k-line file to hundreds of tokens | [https://code.claude.com/docs/en/costs.md#offload-processing-to-hooks-and-skills](https://code.claude.com/docs/en/costs.md#offload-processing-to-hooks-and-skills) |
| **Code intelligence plugins** | LSP servers give Claude precise symbol navigation instead of text-based grep; fewer file reads | [https://code.claude.com/docs/en/costs.md#install-code-intelligence-plugins-for-typed-languages](https://code.claude.com/docs/en/costs.md#install-code-intelligence-plugins-for-typed-languages) |
| **Clear between tasks** | `/clear` starts fresh; stale context wastes tokens on every message | [https://code.claude.com/docs/en/costs.md#manage-context-proactively](https://code.claude.com/docs/en/costs.md#manage-context-proactively) |
| **Model selection** | Sonnet < Opus in cost; use Haiku for subagents | [https://code.claude.com/docs/en/costs.md#choose-the-right-model](https://code.claude.com/docs/en/costs.md#choose-the-right-model) |
| **Extended thinking control** | Disable or lower thinking budget for tasks that don't need deep reasoning (effort level, `/model` config, or `MAX_THINKING_TOKENS` env var) | [https://code.claude.com/docs/en/costs.md#adjust-extended-thinking](https://code.claude.com/docs/en/costs.md#adjust-extended-thinking) |
| **Plan mode** | Shift+Tab to enter plan mode; Claude explores first, proposes approach for approval; prevents expensive re-work | [https://code.claude.com/docs/en/costs.md#work-efficiently-on-complex-tasks](https://code.claude.com/docs/en/costs.md#work-efficiently-on-complex-tasks) |

**Agent SDK**  (for programmatic use): The Agent SDK inherits these optimizations; you can configure subagents, MCP tool deferral, and compaction behavior via SDK configuration.
[https://platform.claude.com/llms.txt](https://platform.claude.com/llms.txt) (see Agent SDK docs on context management)

---

## Key Takeaways for Your Use Cases

1. **Global vs Project**: Project-level `.claude/` is the default; use plugins + marketplaces for distribution to teams/clients.
2. **Company OS**: Build a plugin with bundled skills, agents, hooks; host in a marketplace repo; clients install once.
3. **Cloud Sync**: Don't put `.git` in OneDrive/Google Drive; use Claude Code on the web (cloud) or GitHub Desktop + local disk.
4. **Slack**: Official integration available and working; Teams lacks an official integration (use MCP or migrate to Slack).
5. **Onboarding**: SessionStart hooks + onboarding skill can interview users and configure workspace interactively.
6. **Token Efficiency**: Auto-compaction, prompt caching, subagents, skills, and preprocessing hooks are the core tools; deferred MCP tool search is enabled by default.

All answers cite the official Claude Code documentation at **https://code.claude.com/docs** (2026 version, last updated 2026-07-03).

---

# Part 3 — GitHub CompanyOS landscape survey (12+ projects)

Research complete. Here is the structured summary.

# "Company OS" / "Business OS" templates on Claude Code — research findings

## A. Notable repos (with stars as of early July 2026; counts from GitHub pages / secondary sources, approximate)

**1. Workflowsio/company-os-starter-kit — ~72★, 17 forks**
https://github.com/Workflowsio/company-os-starter-kit
- Ships a `blueprint/` folder as the canonical structure: `company/` (overview, team, accounts, gtm-stack, voice, design-system), `wiki/` (outbound-playbook, onboarding, processes), `hooks/`, `skills/`, `archive/`, `raw/`. CLAUDE.md is the root pointer file ("Not a prompt you paste. An operating system that compounds").
- 5 GTM skills (outbound copywriter, LinkedIn writer, ICP modeler, GTM strategist, discovery prep), a plugin with 6 workflow commands (`plan, work, review, swarm, brainstorm, compound` — clearly modeled on Every's compound-engineering loop), 3 hooks (PreToolUse safety-guard blocking destructive actions, JSONL session logger, desktop notify).
- Audience: GTM teams / technical founders. Onboarding: no dedicated skill — README tells you to prompt Claude "Interview me about my business and help me fill everything in. Go section by section."
- No Slack/Teams integration. Everything project-level in `.claude/`.

**2. riccardovandra/business-os — ~25★**
https://github.com/riccardovandra/business-os
- Three-folder convention: `context/` (business memory), `.claude/` (skills/commands/agents), `workspace/` (outputs: foundations, content, docs, journal). Multi-tool: CLAUDE.md + AGENTS.md + GEMINI.md.
- Ships a `/morning` daily-brief command and a YouTube-transcript skill. Mental model: "You are the manager. The AI is the executor."
- Slack only as a `SLACK_WEBHOOK_URL` env var stub. Project-level skills. No onboarding wizard (4-step quick start).

**3. Lifecycle-Innovations-Limited/claude-ops — ~19★ but the deepest build (846 commits, 143 releases, v2.38.x June 2026)**
https://github.com/Lifecycle-Innovations-Limited/claude-ops (surfaced via awesome-claude-code issue #1509: https://github.com/hesreallyhim/awesome-claude-code/issues/1509)
- A Claude Code **plugin** (marketplace install → effectively global, not per-repo): ~22 skills / 14+ slash commands (`/ops:go` morning briefing, `/ops:inbox`, `/ops:triage`, `/ops:revenue`, `/ops:ecom`, `/ops:marketing`, `/ops:yolo` 4 parallel C-suite agents), ~21 agents in 12 teams with model tiering (Opus C-suite, Sonnet scanners, Haiku fixers), SessionStart hook, and 7 background daemons (briefing pre-warm every 2 min, WhatsApp sync, memory extractor every 30 min, inbox digest, competitor intel).
- **Unified inbox** is the standout messaging pattern: WhatsApp via `wacli` CLI + keepalive daemon, Gmail via MCP OAuth or `gog` CLI, **Slack via MCP OAuth (limited) or local bot token (full search/private channels)**, Telegram via a bundled MTProto MCP server.
- Onboarding: `/ops:setup` interactive wizard — installs daemons early, "credential deep-hunt" across env/1Password/Doppler/Keychain, then per-integration MCP-vs-CLI choice. Target: founder-led startups running SaaS + e-commerce + infra.

**4. bradfeld/ceos — ~137★**
https://github.com/bradfeld/ceos (writeup: https://feld.com/archives/2026/02/streamline-workflow-with-ceos-claude-meets-eos/)
- Brad Feld's "Claude + EOS": 16 skills implementing Entrepreneurial Operating System rituals (`ceos-vto`, `ceos-rocks`, `ceos-scorecard`, `ceos-l10`, `ceos-ids`, `ceos-accountability`, `ceos-people`, `ceos-quarterly`, `ceos-annual`, `ceos-checkup`, `ceos-kickoff`, etc.). EOS data lives as markdown in a `data/` dir in your fork — "no database, no SaaS, no vendor lock-in."
- Explicitly **nontechnical audience**: "Designed for CEOs and leadership teams, not developers." Onboarding: fork → `./setup.sh init` → 4 questions (company, quarter, team, L10 day). Project-level; no messaging integrations.

**5. dswh/company-os — ~23★ (the strongest "onboarding skill" precedent)**
https://github.com/dswh/company-os
- "Self-installing AI-native company OS seed": clone, open in Claude Code/Codex, paste one instruction; the agent reads `INSTALL_FOR_AGENTS.md`, interviews you, seeds the knowledge base, connects tools, configures workflows. New team members onboard via `ONBOARD_FOR_AGENTS.md`, inheriting the brain with scoped department access.
- Structure is the most "org-shaped" found: `brain/` (customers, people, decisions), **`departments/`** (business functions as workflow loops), `tools/` (registry with access tiers), `skills/` + RESOLVER index, `reviews/` (quality gates), `logs/`, `inbox/` (append-only capture), `dream/` (self-improvement), `scoreboard.md` (metrics). No Slack/Teams. Project-level.

**6. nateherkai/AIS-OS — ~898★, 284 forks**
https://github.com/nateherkai/AIS-OS
- Three-skill kit with an explicit **`/onboard` wizard**: interactive 7-question interview (~15 min) that captures business context + voice samples and auto-generates the Day-1 file set and CLAUDE.md. Plus `/audit` (weekly "Four Cs" gap analysis: Context/Connections/Capabilities/Cadence) and `/level-up` (weekly "3Ms" interview — Mindset/Method/Machine — that ships one automation per week).
- Structure: `context/`, `decisions/log.md` (append-only), `connections.md` (system registry), `references/`, `archives/`, `.claude/skills/`. Audience: solopreneurs/operators/AI consultants (companion to a masterclass). Messaging left abstract as the "Connections" layer.

**7. carlvellotti/carls-product-os — ~211★, 59 forks**
https://github.com/carlvellotti/carls-product-os
- A PM's personal OS: `CLAUDE.md`, `GOALS.md`, `Tasks/`, `Projects/` (one-off), `Workflows/` (repeatable), `Meetings/`, `Knowledge/`, `Templates/`, `.claude/skills/`, `_Registry/`, `_temp/`. Ships both BLANK-OS (empty template) and EXAMPLE-OS (filled reference) — a nice onboarding-by-example pattern. Tied to his "Claude Code for PMs / for Everyone" courses. Project-level, no messaging.

**8. CronusL-1141/AI-company — ~309★**
https://github.com/CronusL-1141/AI-company
- "Multi-agent team OS for Claude Code": 107 MCP tools across 22 modules, 25–40 agent templates (engineering-heavy), 9–10 lifecycle hooks (SessionStart→PreCompact), 7 pipeline workflows, persistent teams, structured meetings, task wall, React dashboard. Notably supports **both** `~/.claude/agents/` (global) and `.claude/agents/` (project) installs. Messaging via "ecosystem recipes" for GitHub, **Slack (notifications/escalation)**, Linear. Onboarding: plugin marketplace / `install.py` / PyPI, plus "CC-assisted installation" (tell Claude to read INSTALL.md).

**9. Claw-Company/clawcompany — ~577★** (adjacent: not Claude Code-native)
https://github.com/Claw-Company/clawcompany
- `npx clawcompany` TypeScript app, BYOK multi-provider. 38 role personas (CEO/CTO/CFO...), 6 company templates (YC Startup, Trading Desk, Research Lab...), 4-layer memory (chairman prefs → auto-categorized company data → compressed archives → session). Messaging: WebChat, **Telegram, Discord, "Slack coming."** Audience "everyone."

**10. EliteSystemsAI/operator-os — 0★, early**
https://github.com/EliteSystemsAI/operator-os
- Claude Code workspace for business operators: 15+ commands (`/morning`, `/revenue`, `/leads`, `/script`, `/ads`...), 12 skills (email triage, Slack messaging, Drive, cold email, invoice extraction), **Telegram bot for mobile command execution**, Slack via user token, Supabase memory, GoHighLevel/Stripe/ClickUp/Meta integrations. Onboarding: `install.sh` + fill `.env`, CLAUDE.md, `knowledge/` files. Project-level.

**11. coleam00/second-brain-skills — ~788★** (+ second-brain-starter)
https://github.com/coleam00/second-brain-skills and https://github.com/coleam00/second-brain-starter
- Cole Medin's skills to turn Claude Code into a second brain: **SOP Creator**, Brand & Voice Generator, PPTX generator, MCP client (Zapier/GitHub), Skill Creator, Remotion video. Project-level `.claude/skills/`. The starter repo's onboarding gimmick: a skill that **generates a personalized PRD** for building your own assistant (memory, integrations, heartbeat, chat UI). Related ecosystem: huytieu/COG-second-brain (17 skills, 6 worker agents, people CRM, PARA), AgriciDaniel/claude-obsidian, gokhanarkan/minimal-second-brain (manifest-updating hook).

**12. EveryInc/compound-engineering-plugin — ~22.6k★** (the Dan Shipper / Every / Cora lineage)
https://github.com/EveryInc/compound-engineering-plugin
- Official plugin distilled from building **Cora** (Every's AI chief-of-staff email product): 27–28 skills, `/ce-brainstorm`, `/ce-plan`, `/ce-work`, `/ce-code-review`, `/ce-compound`, `/lfg`, plus business-leaning ones (`/ce-strategy`, `/ce-product-pulse`, `/ce-ideate`, `/ce-promote`, feedback analysis). Installs via plugin marketplace (global), reads project grounding from `STRATEGY.md` and `docs/solutions/` learnings. Philosophy "80% planning/review, 20% execution"; each cycle documents learnings — this is the loop most Company OS templates copy. Background: https://every.to/guides/compound-engineering

## B. obra/superpowers specifically

https://github.com/obra/superpowers — Jesse Vincent's "agentic skills framework & software development methodology." Massive: secondary sources track ~89k stars (Mar 2026) → ~121k → ~224k (June 2026) → ~244k (July 2026) (https://byteiota.com/superpowers-skills-framework-hits-121k-stars-agents-evolve/, https://rywalker.com/research/superpowers-skills-framework). Contents: ~20+ dev-process skills — test-driven-development, systematic-debugging, brainstorming, writing-plans, executing-plans, dispatching-parallel-agents, requesting/receiving-code-review, using-git-worktrees, subagent-driven-development, writing-skills, using-superpowers — plus `/brainstorm`, `/write-plan`, `/execute-plan` commands and a skills-search tool. **No business-ops skills.** Installation: `/plugin install superpowers@claude-plugins-official` — plugins install per-user (global to your Claude Code install, not per-repo), with a session-start hook that makes skill checks "mandatory workflows, not suggestions." Works across Claude Code, Codex, Cursor, etc. Satellites: obra/superpowers-marketplace, obra/superpowers-skills (community), obra/superpowers-lab.

## C. Token/context-optimization add-ons people commonly bolt on

- **Context7** (Upstash) — MCP server pulling version-correct library docs at query time; valued partly *because* it exposes only 2 tools (low context overhead). https://claudefa.st/blog/tools/mcp-extensions/context7-mcp
- **ooples/token-optimizer-mcp** — claims 60–95% context reduction via caching/compression/tool replacement. https://github.com/ooples/token-optimizer-mcp
- **zilliztech/claude-context** — semantic code-search MCP so the whole codebase doesn't enter context. https://github.com/zilliztech/claude-context
- Native mitigations increasingly replace plugins: Claude Code's **tool-search deferred loading** cut MCP context ~47% (51k→8.5k tokens) (https://medium.com/@joe.njenga/claude-code-just-cut-mcp-context-bloat-by-46-9-51k-tokens-down-to-8-5k-with-new-tool-search-ddf9e905f734); practitioners also prune MCP servers per Scott Spence's guide (https://scottspence.com/posts/optimising-mcp-server-context-usage-in-claude-code). claude-ops's approach: offload gathering to background daemons + warm cache so briefings don't burn context; AI-company hooks PreCompact.

## D. Cross-cutting patterns

**Folder structure — a consistent grammar emerges (4 layers):**
1. **Root pointer:** `CLAUDE.md` (often + `AGENTS.md`/`GEMINI.md`) pointing at everything else; sometimes `GOALS.md`.
2. **Context/memory:** `context/`, `knowledge/`, `brain/`, or `company/` (overview, team, voice, ICP, accounts) + append-only `decisions/log.md` and `inbox/` capture. SOPs live in `wiki/`, `Workflows/`, or an SOP-creator skill.
3. **Capabilities:** `.claude/skills|commands|agents|hooks` in-repo. Only dswh/company-os uses literal `departments/`; most use function-shaped folders (GTM, content, revenue) instead of org charts.
4. **Output:** `workspace/`, `Projects/` vs `Workflows/` (one-off vs repeatable — Carl's OS makes this distinction explicit), `archive/`, `logs/`, `scoreboard.md`.

**Most commonly shipped skills/commands across projects:** (1) morning briefing (`/morning`, `/ops:go`, daily brief) — near-universal; (2) inbox/email triage; (3) content/GTM writing (LinkedIn, outbound, brand voice); (4) the compound-engineering loop (`plan → work → review → compound`) copied from Every; (5) SOP/process creators; (6) revenue/metrics snapshots (Stripe). Common hooks: PreToolUse safety guard blocking destructive commands, session logger, SessionStart health check/context loader.

**Global vs project-level for EA-type skills:** Company/Business OS *templates* keep everything **project-level** (`.claude/` in the repo) — the repo IS the company and is meant to be forked/shared. Personal-assistant setups trend **global**: guides tell users to install to `~/.claude/commands` (https://www.mindstudio.ai/blog/ai-executive-assistant-claude-code-google-workspace, https://claudeblattman.com/toolkit/executive-assistant/), and marketplace-distributed plugins (superpowers, compound-engineering, claude-ops) are inherently per-user/global. AI-company explicitly supports both paths. The de facto rule: methodology/EA skills → global plugin; company knowledge + business-specific skills → in-repo.

**Messaging integrations:** Slack is surprisingly weak everywhere — a webhook env var (business-os), MCP OAuth or bot token (claude-ops), notification recipes (AI-company), "coming soon" (clawcompany). **Telegram is the pragmatic favorite** (bundled MTProto MCP in claude-ops; bots in operator-os and clawcompany) because it's easiest to self-serve. WhatsApp appears via `wacli` daemon (claude-ops). **Microsoft Teams: absent from every project found.**

**Onboarding-skill precedents (strongest → weakest):** claude-ops `/ops:setup` (full wizard + credential hunting + daemon install); AIS-OS `/onboard` (7-question interview auto-generating CLAUDE.md + Day-1 files); dswh/company-os (agent-executed `INSTALL_FOR_AGENTS.md`/`ONBOARD_FOR_AGENTS.md`); CEOS `setup.sh init` (4 questions); coleam00's PRD-generating starter skill; and the informal "interview me about my business, go section by section" prompt (company-os-starter-kit). The interview-then-generate-files pattern is the clear convention.

**Directories/collections for sourcing components:** hesreallyhim/awesome-claude-code (~36.8k★, curated; https://github.com/hesreallyhim/awesome-claude-code), davila7/claude-code-templates (900+ components with web UI; https://github.com/davila7/claude-code-templates), plus BMAD-METHOD (https://github.com/bmad-code-org/bmad-method) — agile-team-as-agents (Analyst/PM/Architect/Dev) which is the software-delivery analog of a company OS, with Claude Code ports at aj-geddes/claude-code-bmad-skills and PabloLION/bmad-plugin. GitHub topics pages worth watching: https://github.com/topics/company-os and https://github.com/topics/company-as-code.

---

