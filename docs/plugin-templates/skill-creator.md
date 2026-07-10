# Skill Creator — Build and Test Your Own Skills

## Is this for you?

This template already includes `/skill-builder`, a guided way to create new
business skills by answering questions. **Most clients only need that.**
Skill-creator is Anthropic's official plugin for people who want to go deeper:
it adds tooling to create skills from scratch, measure how reliably they
trigger, and benchmark changes before rolling them out.

Rule of thumb: start with `/skill-builder`. Install skill-creator when you find
yourself maintaining several custom skills and wanting to test them properly.

## What it adds

- Guided skill creation and editing, same territory as `/skill-builder` but
  with more machinery.
- Evals: run test cases against a skill to see how it behaves.
- Trigger-accuracy checks: measure whether a skill fires when it should (and
  stays quiet when it shouldn't).

## Install

Run inside a Claude Code session:

```
/plugin install skill-creator@claude-plugins-official
```

This uses Anthropic's official plugin marketplace, which is already available
by default — no separate `/plugin marketplace add` step needed. Restart Claude
Code (`exit`, then `claude`) after installing.

## What changes for you

Nothing automatic — the plugin's tools activate when you ask to create, edit,
test, or benchmark a skill. Your existing `/skill-builder` keeps working; the
two can coexist, and Claude will use the richer tooling when it's available.
