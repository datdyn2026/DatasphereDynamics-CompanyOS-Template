# Email Integration (Gmail / Outlook 365)

Connecting your email is what makes `/morning` show today's calendar and the messages waiting on you, and `/inbox-triage` sort your real inbox. It takes about 5 minutes, and the `/onboard` wizard walks you through it — this page is the same walkthrough for doing it later, plus troubleshooting.

## The recommended path: Composio

Composio is a connector service: it handles the sign-in handshake with Google or Microsoft so there are no keys or config files to manage. You approve access once in your browser; you can take that access away at any time.

1. **Add the connector.** In a Claude Code session, ask Claude to run this (or paste it into your terminal yourself):
   ```
   claude mcp add --transport http rube -s user "https://rube.app/mcp"
   ```
   Then restart Claude Code (`exit`, then `claude`).
2. **Sign in to Composio.** Type `/mcp`, pick **rube**, choose **Authenticate**. A browser window opens — sign in (or create a free Composio account) and click Approve.
3. **Connect your mailbox.** Back in the session, say "connect my Gmail" or "connect my Outlook". Claude replies with a sign-in link — click it, sign in to your Google or Microsoft account, and click **Allow**. That's the standard consent screen you've seen when connecting any app. Quick safety habit: the link should go to composio.dev, rube.app, accounts.google.com, or login.microsoftonline.com — if it looks like anything else, don't click it.
4. **Check it works — two tests you can see:**
   - Ask: *"What's on my calendar today, and what's the newest email in my inbox?"* The answer should match your mailbox.
   - Ask: *"Create a draft email to myself with the subject 'CompanyOS connection test'."* Open your **Drafts** folder — it should be sitting there. Delete it whenever; nothing was sent.

## What Claude can and can't do once connected

- **Can:** read and search email, read your calendar, create reply drafts, archive or label messages you've dealt with.
- **Only when you say so:** drafts, archiving, and labels happen only when you pick that action for that message (e.g. during `/inbox-triage`) — never in the background.
- **Will always ask first:** sending. No email leaves your account without a per-message yes from you.
- **Your data:** Composio holds the connection to your mailbox on its side. If your company has rules about third-party tools, check before connecting. You can revoke access anytime — from the Composio dashboard, or from your Google Account / Microsoft account security page ("third-party access").

## Troubleshooting

- **`rube` doesn't show up in `/mcp`** — restart Claude Code (`exit`, then `claude`), then check `claude mcp list` in your terminal; you should see `rube` in the list.
- **Authenticate didn't open a browser** — you may be on a remote machine; copy the printed URL into your own browser instead.
- **Connected, but Claude says it can't see email** — in `/mcp`, pick rube and re-authenticate; then redo step 3 (the mailbox link is a separate approval from the Composio sign-in).
- **It worked before and stopped** — access tokens expire sometimes. `/mcp` → rube → Re-authenticate fixes it.

## Other ways (for IT teams / advanced users)

Any Gmail or Outlook MCP server works with this workspace as long as it can read email, read the calendar, and create drafts (archive/label support is a plus) — the skills detect whatever email tools are available; nothing is hardcoded to Composio:

- **Bring your own MCP server.** If your IT team runs one (self-hosted, or a vendor like Zapier MCP), add it with `claude mcp add` and the skills will pick it up.
- **Anthropic's built-in claude.ai connectors** (Settings → Connectors on claude.ai) also cover Gmail and Microsoft 365, but they are **read-only** — briefings work, but `/inbox-triage` can't create drafts or archive anything. Fine as a stopgap; note the Microsoft 365 one requires a business Microsoft account.
