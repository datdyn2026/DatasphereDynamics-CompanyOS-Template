# Creating Word, Excel, PowerPoint, and PDF Files

Claude can write real Word documents, Excel spreadsheets, PowerPoint decks, and PDFs for you — not just plain text. These are Anthropic's official document skills, the same ones behind Claude's "create files" feature.

## Where they work

- **Claude Code on the web / claude.ai**: available by default — nothing to install.
- **Claude Code desktop/CLI**: install once as a plugin (see below).

## Install (desktop/CLI only)

Run this once inside a Claude Code session:

```
/plugin marketplace add anthropics/skills
```

Then install the document skills:

```
/plugin install document-skills@anthropic-agent-skills
```

(Or use the interactive menu: `Browse and install plugins` → `anthropic-agent-skills` → `document-skills` → `Install now`.)

## Asking for each format

Just describe what you want in plain language — Claude picks the right skill automatically:

- **Word**: "Write up this week's client update as a Word document."
- **Excel**: "Put this list of expenses into a spreadsheet with a total row."
- **PowerPoint**: "Turn this workflow into a 5-slide deck I can present."
- **PDF**: "Export the SOP I just wrote as a PDF" (or: "pull the form fields out of this PDF").

## Where files land

Generated documents land in `workspace/drafts/` in this repo, so they're easy to find, review, and clean out later. Nothing overwrites your source `company/`, `workflows/`, or `projects/` files — documents are always new output, not edits to your workspace's own markdown.
