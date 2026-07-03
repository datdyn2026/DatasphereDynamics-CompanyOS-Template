# Microsoft Teams Integration

Honest answer up front: **there is no official "@Claude in Teams" integration**, unlike Slack. If you need Teams support today, you have two real options — one you can set up yourself, one that needs a developer.

## Option A: Read Teams/Outlook/SharePoint data in your sessions (no developer needed)

Claude can connect to Microsoft 365 as a data source through an MCP connector. This doesn't put Claude *inside* Teams as a chat participant, but it lets a Claude Code session search your Teams messages, Outlook email and calendar, and SharePoint files while you're working — useful for pulling context into a briefing, drafting a reply, or checking a document.

Ask your Claude Code administrator or IT contact to enable the Microsoft 365 connector for your account. Once connected, you can ask things like "check my calendar for conflicts this week" or "find the SharePoint doc about the Q3 budget" directly in a session.

Note: for Outlook email and calendar specifically, this workspace's recommended setup is the email integration in `docs/integrations/email.md` (it can also draft and archive, not just read). The Microsoft 365 connector adds Teams messages and SharePoint on top.

## Option B: A true in-Teams bot (developer add-on)

If you want people to message an assistant directly inside Teams the way Slack users message `@Claude`, that requires a custom build — it is not part of this template. At a high level, it looks like:

1. **Register a bot** with Microsoft's Bot Framework / Azure Bot Service, tied to your Teams tenant.
2. **Stand up a small service** using the Claude Agent SDK that receives messages and calls Claude to handle them.
3. **Wire a webhook** from Teams (via the Bot Framework) into that service so messages route to Claude and responses route back.
4. **Host the service** somewhere always-on (a small cloud VM or serverless function).
5. **Scope permissions** in Teams/Azure AD so the bot only sees the channels it needs.
6. Optionally connect it to this repo (via GitHub) so the bot can trigger real Claude Code sessions, similar to the Slack integration.

This is a solid, sellable project for a developer — budget it as a separate add-on, not something included in this template.

## Bottom line

For most nontechnical teams, Option A (Microsoft 365 MCP connector) covers the common need — "let Claude see my Teams/Outlook/SharePoint stuff." Option B is only worth it if you specifically want people typing to Claude from inside Teams.
