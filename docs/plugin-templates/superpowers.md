# Superpowers — Software Development Methodology

## Is this for you?

This CompanyOS template already ships business-focused skills adapted for nontechnical work — brainstorming ideas, writing plans, running SOPs. **Most clients don't need this plugin.** Superpowers is a much larger methodology built specifically for *writing and shipping software*: strict test-first development, multi-step engineering plans, and structured debugging.

Install this only if your team also builds or maintains software (an app, a website's codebase, internal tooling) and wants Claude to follow a rigorous engineering process for that work.

## What it adds

Superpowers gives Claude a complete software development discipline: before writing code, it steps back to clarify what you actually want; it turns that into a plan clear enough for a junior engineer to follow; then it works through the plan step by step, with tests written before the code that makes them pass, and reviews its own work as it goes. It also includes skills for systematic debugging and structured code review.

## Install

Run inside a Claude Code session:

```
/plugin install superpowers@claude-plugins-official
```

This uses Anthropic's official plugin marketplace, which is already available by default — no separate `/plugin marketplace add` step needed.

## What changes for you

Once installed, these skills trigger automatically whenever a conversation starts to look like a software task — you don't need to invoke them by name. If your work is entirely non-software (writing, planning, operations), you likely won't notice a difference, since those tasks are already covered by this template's own skills.
