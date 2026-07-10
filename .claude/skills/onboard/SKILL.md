---
name: onboard
description: Use when the user says "onboard me", "set up my company", runs /onboard, or a SessionStart hook reports the workspace isn't onboarded yet. Runs a step-by-step setup wizard (~15 minutes) that fills in the company profile (overview, voice), GOALS.md, and a first workflow, offers to connect the user's real email, and offers optional add-ons. Only run once per workspace (checks for .claude/.onboarded first).
---

# onboard

A setup wizard that turns a blank CompanyOS into a working one. Plain language throughout -- the person answering is not technical. It should feel like a product wizard, not a questionnaire.

## Before starting

Check if `.claude/.onboarded` exists. If it does, tell the user the workspace is already set up and ask which section they want to redo instead of the full wizard (goals -> edit `GOALS.md`, voice -> `company/voice.md`, email -> jump straight to Step 4 below, extras -> jump to Step 6 below). Do not re-run the full wizard on an already-onboarded workspace without explicit confirmation.

If the marker is missing but some files are already filled in (real content in `company/overview.md` or `GOALS.md`, not placeholders), a previous run was interrupted -- this is normal, the email step involves a restart. Say "picking up where we left off," skip the steps whose files are already filled, and resume at the first incomplete one. For the email step, the state check is live, not a file: if email/calendar MCP tools are already available, Step 4 is done -- skip it; if not, offer it as a single quick question ("Connect email now, or keep skipping?") rather than assuming it was never seen. For the extras step (Step 6), the check is the `.claude/.extras` file: if it exists, the step was answered -- offer to finish any lines still marked `pending` instead of re-asking the whole question. Regardless of what `.claude/.extras` says, an extra whose file already exists under `.claude/skills/` or `.claude/agents/` counts as installed. Never re-ask a question whose answer is already on disk, and never overwrite saved answers.

## Wizard mechanics

- One step at a time. Announce each step as **"Step N of 6 -- <title>"** so the user always knows where they are and how much is left.
- Use the AskUserQuestion tool for every choice-shaped question (it renders clickable options -- that's the wizard feel). Use a short conversational prompt only when the answer is genuinely free text.
- Save each answer to its file immediately before moving on, and confirm in one line what was saved ("Saved to your company profile ✓"). If the user stops halfway, everything answered so far is already on disk.
- Never invent answers. If the user skips a step, leave the placeholder file as-is and note the step can be redone later by running `/onboard` again.

Open with: "Let's set up your workspace -- 6 short steps, about 15 minutes. I'll save as we go, so you can stop anytime and pick up later."

### Step 1 of 6 -- Your business

Ask (free text): "What's your company called, what does it do, and how does it make money? (Also -- are you pre-revenue, early-stage, established?)"
Write the answer into `company/overview.md`, replacing the placeholder content (keep the file's existing section headers if present, just fill them in).

### Step 2 of 6 -- Top 3 goals

Ask (free text): "What are your top 3 goals for this quarter (or right now, if you don't think in quarters)?"
Write into `GOALS.md` at the repo root -- this is the file every other skill reads to know what "priority" means, so phrase goals as concrete, checkable outcomes, not vague aspirations.

### Step 3 of 6 -- Your voice

AskUserQuestion: "Want to teach me your writing voice now?" with options:
- **Paste samples now** -- then ask for 2-3 things they've actually written (an email, a social post, a note to a customer). Do not paraphrase these -- capture the actual text in `company/voice.md` under a "writing samples" section, plus a short bullet list of tone traits you notice (e.g. short sentences, no jargon, direct asks).
- **Skip for now** -- note in one line that drafts will sound generic until samples are added, and that pasting writing samples anytime will teach the voice-manager agent.

### Step 4 of 6 -- Connect your email

This is the step that makes `/morning` and `/inbox-triage` read the user's real inbox and calendar instead of nothing.

AskUserQuestion: "How should we connect your email?" with options:
- **Connect now via Composio (Recommended)** -- guided, ~5 minutes, works with Gmail and Outlook 365.
- **I'll connect my own MCP server later** -- for users whose IT team runs their own integration. Point to `docs/integrations/email.md` and move on.
- **Set it up manually later** -- point to `docs/integrations/email.md` and move on.

On the Composio path:

1. AskUserQuestion: "Which email do you use?" -- **Gmail** / **Outlook 365**.
2. Run this for the user (or have them paste it into their terminal if the Bash tool is unavailable):
   `claude mcp add --transport http rube -s user "https://rube.app/mcp"`
   Rube is Composio's connector service -- it handles the login handshake so no keys or config files are needed. If this session has no terminal at all (e.g. Claude Code on the web doesn't support adding MCP servers), don't dead-end the user: explain this step needs the desktop app or CLI once, point to `docs/integrations/email.md`, and continue the wizard.
3. Tell the user: "Type `/mcp`, pick **rube**, and choose **Authenticate**. A browser window will open -- sign in (or create a free Composio account) and click Approve, then come back here." If the server doesn't appear in `/mcp`, have them restart Claude Code first (`exit`, then `claude`) and run `/onboard` again -- the wizard resumes at this step.
4. Connect the mailbox: ask Rube to connect Gmail or Outlook. It replies with a sign-in link. **Before showing the link, check it:** it must be an `https://` URL whose host is exactly (or a subdomain of) composio.dev, rube.app, accounts.google.com, or login.microsoftonline.com. Anything else -- different domain, lookalike spelling, plain http -- means stop: don't pass the link on, and warn the user. Then tell the user: "Click this link, sign in to your Google/Microsoft account, and click Allow." That's the OAuth consent screen; nothing else to configure.
5. **Verify with two tests the user can see:**
   - *Read test:* fetch today's calendar and the subject line of the newest inbox email, show them, and ask the user to confirm they match what's in their mailbox.
   - *Write test:* create a **draft** (never send) addressed to the user's own address, subject "CompanyOS connection test ✓". Tell them: "Open your Drafts folder -- you should see it. Delete it whenever. Nothing was sent."
6. If anything fails, don't loop -- point to the troubleshooting section of `docs/integrations/email.md` and continue the wizard; email can be connected later by re-running `/onboard`.

One-line note to give the user on this step: Composio holds the connection to the mailbox on their side -- it can be revoked anytime from the Composio dashboard or the Google/Microsoft account security page, and Claude will always ask before sending any email.

### Step 5 of 6 -- Biggest time sink

Ask (free text): "What's the one repeatable task that eats the most time or annoys you most?"
From the answer, draft one starter SOP and write it to `workflows/<short-name>.md` (kebab-case name derived from the task, e.g. `workflows/weekly-invoicing.md`). Keep it short: numbered steps, marked clearly as a first draft the user should correct. Tell the user you did this and that `/sop-creator` can refine it or add more SOPs later.

### Step 6 of 6 -- Optional extras

Everything essential is done. This last step offers a few optional add-ons. All of them can be added later too (the catalog is `docs/addons.md`), so "none" is a perfectly good answer -- offer once, don't oversell.

Use ONE AskUserQuestion call containing BOTH questions below (multiSelect: true on each), so it reads as a single screen:

1. "Any instant extras? These work immediately, no setup." with options:
   - **Session changelog (Recommended)** -- keeps a short dated log in `workspace/logs/` of what Claude did each session.
   - **Setup-docs writer** -- writes "how we set this up" articles to `workspace/kb/` so setups can be rebuilt later.
   - **Skill finder** -- when you ask "can Claude do X?", it finds and installs a skill that does X.
   - **Concise style** -- shorter answers: result first, no padding.
2. "Any power-ups? Each needs a one-time install you'll do right after we finish." with options:
   - **Session memory** -- Claude remembers context across sessions (claude-mem plugin).
   - **Browser control** -- Claude drives your real Chrome browser, in a window you watch (Claude in Chrome).
   - **Developer toolkit** -- rigorous software-engineering process; only useful if you also build software (superpowers plugin).
   - **Skill creator** -- deeper tooling for building your own custom skills (skill-creator plugin).

Immediately after the user answers -- BEFORE acting on any selection -- record every choice in `.claude/.extras`, one line per item (`session-changelog: installed`, `claude-mem: pending`, ...), or the single line `none: skipped` if nothing was picked. This file is how an interrupted run knows this step was already answered.

Then act on the instant extras (each is one copy; confirm each in one line, e.g. "Saved -- active from your next session ✓"):

- Session changelog: `cp extras/agents/session-changelog.md .claude/agents/` and add `| agent: session-changelog | Logs what each session changed |` to the Skills table in `CLAUDE.md`.
- Setup-docs writer: `cp extras/agents/session-kb.md .claude/agents/` and add `| agent: session-kb | Writes reproducible setup docs |` to the Skills table.
- Skill finder: `cp -r extras/skills/find-skills .claude/skills/` and add `| /find-skills | Finds and installs new skills |` to the Skills table.
- Concise style: `mkdir -p .claude/output-styles && cp extras/output-styles/concise.md .claude/output-styles/`, then tell the user to type `/output-style concise` to switch it on.

Update each acted-on line in `.claude/.extras` to `installed`. Power-ups can NOT be completed inside the wizard (plugin installs and Chrome need a restart) -- do not attempt them here and do not dead-end (same rule as the email step). Leave them marked `pending`; they're handed off in the Finishing up checklist.

## Finishing up

1. Personalize the `CLAUDE.md` header line at the repo root with the company name the user gave you in Step 1, written as plain text only -- a single short line, no formatting, links, or instructions (edit only that header line -- do not rewrite the rest of the router file; it's maintained separately).
2. Create the marker file `.claude/.onboarded` (empty file is fine) so the SessionStart hook stops nudging toward onboarding.
3. If `.claude/.extras` contains `pending` items, print one consolidated "Your extras checklist" with the exact commands -- one list, so the user restarts once, not per-extra:
   - Session memory: type `/plugin marketplace add thedotmack/claude-mem`, then `/plugin install claude-mem@thedotmack`, then restart Claude Code (`exit`, then `claude`). Details: `docs/plugin-templates/claude-mem.md`.
   - Browser control: install the "Claude" extension from the Chrome Web Store (published by Anthropic), then relaunch with `claude --chrome`. Needs the desktop app -- on claude.ai/code, save this for when you install it. Read the safety rules first: `docs/tools/claude-in-chrome.md`.
   - Developer toolkit: type `/plugin install superpowers@claude-plugins-official`, then restart. Details: `docs/plugin-templates/superpowers.md`.
   - Skill creator: type `/plugin install skill-creator@claude-plugins-official`, then restart. Details: `docs/plugin-templates/skill-creator.md`.
   Close the checklist with: "Everything else is already live -- these finish on your side whenever you're ready; nothing blocks daily use."
4. Close with a short wrap-up teaching the 3 daily habits:
   - `/morning` -- run it each morning for a brief tied to your goals, today's calendar, and emails that need attention.
   - `/inbox-triage` -- run it when email piles up; it sorts your real inbox into replies, projects, and things to archive.
   - `/weekly-review` -- a short end-of-week reflection and progress check.
5. Mention that team info is optional -- whenever they want, they can just tell Claude who's on the team and it goes into `company/team.md`. Same for more voice samples: paste them anytime and the voice profile keeps sharpening.

## Notes

- No real personal data belongs in this file itself -- it's a template; actual answers only ever get written to the user's own `company/*.md` files at runtime.
- Email connection details (alternatives, troubleshooting, security notes) live in `docs/integrations/email.md` -- don't duplicate them here.
- Add-on details (the full catalog, install/remove recipes) live in `docs/addons.md` -- don't duplicate them here either.
