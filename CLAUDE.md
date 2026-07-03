# CLAUDE.md

This repo is your Company OS: a workspace that holds your business context and
runs your recurring work through skills. This file only routes — details live
in the skills themselves. New here? Run `/onboard` first.

## Skills

| Skill | What it does |
|---|---|
| `/onboard` | Setup interview — run this first |
| `/morning` | Daily briefing |
| `/inbox-triage` | Sort inbox/ captures |
| `/write-in-voice` | Draft anything in company voice |
| `/sop-creator` | Turn a process into a workflow doc |
| `/decision-log` | Record a decision |
| `/weekly-review` | Weekly report |
| `/audit` | Gap analysis of your OS |
| `/llm-council` | Multi-perspective deliberation on a decision |
| `/brainstorming` | Structured idea exploration |
| `/writing-plans` | Turn an idea into an actionable plan |
| `/skill-builder` | Create a new custom skill |
| `/agent-builder` | Create a new subagent |
| `/workflow-mapper` | Map and document a business workflow |
| agent: `brand-manager` | Guards brand consistency |
| agent: `voice-manager` | Learns your written+spoken voice from samples |

## Folder map

| Folder | Contents |
|---|---|
| `GOALS.md` | Current quarter's goals |
| `company/` | Your business context: overview, team, voice, ICP, connections |
| `decisions/log.md` | Append-only decision log |
| `inbox/` | Drop anything here; triage later |
| `workflows/` | Your repeatable processes (SOPs) |
| `projects/` | One-off initiatives, one folder each |
| `workspace/` | Generated drafts, reports, logs |
| `archive/` | Completed projects and past quarters |
| `examples/acme/` | Filled example — see what "done" looks like |
| `docs/` | Design notes and setup guide |
| `.claude/` | Skills, agents, hooks, settings |

## Compact instructions

On compaction, always preserve `GOALS.md` in full and any decisions logged
today in `decisions/log.md`. Everything else can be re-read from disk.
