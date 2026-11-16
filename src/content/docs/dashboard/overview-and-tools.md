---
title: Overview, health check and shortcuts
description: The redesigned overview in Sylo 5.2, the health check, the command palette, mentions in message fields and the other tools for running a server.
---

Sylo 5.2 redesigned the [dashboard](/dashboard/v2/) around one question: what
needs doing on this server right now? This page describes the parts that are
new. The setup wizard, Import, Duplicate, templates and change history with undo
are described on the [Dashboard V2](/dashboard/v2/) page.

## The overview

Pick a server and the **Overview** opens with two things.

- **Needs attention** is a short list of what a person has to do. It shows, in
  this order: work that is waiting (open tickets, ban appeals, applications,
  suggestions), modules that are on but not set up, modules the bot cannot run,
  and permissions Sylo is missing. Each item has a link to the page where it is
  fixed. When there is nothing to do, it says "Nothing needs your attention right
  now."
- **Module cards**, grouped by category. Every card has one line that says how
  the module is set up (for example `#welcome · Verified role`), and a coloured
  dot: green for on and set up, amber for on but needing something, grey for off.
  Search the cards by name, or filter by **All**, **Needs setup**, **On** and
  **Off**. On a phone, a category where everything is on and fine starts folded.

## The sidebar

The sidebar is grouped, and only shows what is turned on for the server you are
looking at.

| Group | What is in it |
| --- | --- |
| **Overview** | The page above |
| **Inbox** | Tickets, Appeals, Applications and Suggestions, each with a count of what is waiting |
| **Members & moderation** | The moderation hub, Member data, the Leaderboard and the Audit log |
| **Server** | Server settings and Commands |
| **Modules** | The modules that are switched on, in the same categories as the Overview |
| **More** | The command list, the Roadmap and What's new |

The people who run the instance (the operators) also get a group with the Bot
personalizer, Health, the Roadmap admin and the stats cache.

## Health check

Sylo checks what it is able to do on each server and tells you what it cannot,
and how to fix it. Typical findings are a channel where Sylo is missing Send
Messages or Embed Links, a role that sits above Sylo's own highest role, or a role
that is managed by an integration.

- Problems show up in **Needs attention**, one item per module, with errors first.
  Open the item to see every problem of that module and what to do about it.
- **Role and channel pickers** warn you where you pick: "Sylo can't give this
  role: move Sylo's role above it in the server's role settings", or "Sylo can't
  post in this channel: it is missing Send Messages".
- A module that is waiting for API keys that only an operator can add is listed
  too, for information. There is nothing for the server admin to fix.

On YouTube alerts, the health check also warns when a channel's feed has been
answering "not found" for a whole day. See [YouTube alerts](/modules/youtube-alerts/).

## Command palette

Press **Ctrl+K** (**Cmd+K** on a Mac) anywhere in the dashboard to jump to a
page. Start typing:

- pages and modules of this server, including a module that is switched off, in
  case you are looking for where to switch it on;
- other servers ("Switch to ...");
- members, by name;
- inbox items by number, for example "Ticket #12".

Your last few choices are shown first when the box is empty. Use the arrow keys
and **Enter** to open a result, and **Esc** to close the palette. The old name of
the Tickets module still works as a search word: type "modmail".

## Mentions in message fields

In fields that take a message, type **#** to pick a channel, or **@** to pick a
role or a member. The field then shows the name (`#welcome`, `@Verified`) instead
of the raw id, and a channel or role that has been deleted is marked. Next to the
form, a live preview shows the message the way members will see it.

## Message templates and JSON

The message builder and the Welcome channel can start from a template (Rules,
Welcome card, Announcement, Stream live, Giveaway, Event) and can copy or load the
message as JSON, in the shape Discohook uses. See
[Duplicate and templates](/dashboard/v2/#duplicate-and-templates).

## Published messages follow their channel

For a posted embed message, a Welcome message or a role panel, you can change the
channel and publish again. Sylo deletes the old post and posts a fresh one in the
new channel, so you do not have to clean up by hand.

## Time zones of schedules

Reminders and channel cleanup schedules run in the time zone of the Sylo server,
not in your browser's. The dashboard now says which one next to the time, for
example "at 18:00 (server time: Europe/Oslo)", so you do not have to guess.
