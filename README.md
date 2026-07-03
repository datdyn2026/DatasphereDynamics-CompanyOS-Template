# DatasphereDynamics CompanyOS Template

A ready-made workspace for running your business with Claude Code as your
assistant. It holds your company's context (who you are, what you're working
on, how you like things written) so Claude can help with real work — drafting,
triage, reports, decisions — without you re-explaining yourself every time.

You don't need to know how to code to use this. If you can use a web browser
and answer some questions about your business, you can set this up.

## Get started

1. **Fork this repo.** Click "Use this template" on GitHub to create your own
   copy. Your copy is private and belongs to you.
2. **Open your fork in Claude Code on the web**, connected to your new repo.
   This is the easiest way to use this workspace — no software to install.
3. **Run `/onboard`.** This is a short interview (about 15 minutes) about your
   business, your team, your goals, and how you write. Claude uses your
   answers to fill in the `company/` files and get your first goals into
   `GOALS.md`.

That's it — you're set up.

## Your 3 daily habits

Once you're onboarded, three simple habits keep this workspace useful:

- **`/morning`** — run this to get a quick daily briefing.
- **Drop things in `inbox/`** — any note, idea, or loose thread. Don't sort it
  yourself; just capture it. Sort it later with `/inbox-triage`.
- **`/weekly-review`** — run this once a week for a short report on progress.

## Important: keep this repo out of Dropbox, OneDrive, and Google Drive

Never place this repo (or any git repository) inside a OneDrive, Google Drive,
or Dropbox sync folder. Those sync tools can lock or partially sync files
while Git is writing to them, which can corrupt the repo's history. GitHub is
the source of truth for this workspace — everything lives there. If you want
files backed up, that's what your GitHub fork already does.

## Want more detail?

See `docs/SETUP.md` for a fuller setup walkthrough, including how to connect
Slack so you can message Claude directly from a channel.
