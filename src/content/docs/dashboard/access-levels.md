---
title: Dashboard access levels
description: Give roles View, Inbox or Edit access to a server's dashboard and the Sylo app, and what Sylo refuses to hand out.
---

Since Sylo 5.2 you can decide how much of a server's dashboard a role may use.
There are three levels. The same levels apply in the web dashboard and in the
[Sylo app](/app/ios/), and the Sylo server enforces them, not just the screens.

| Level | Who | What they can do |
| --- | --- | --- |
| **Edit** | The server owner, members with Manage Server or Administrator, and the Edit roles (the bot-master roles) | Everything, as before |
| **Inbox** | The Inbox roles. Ticket staff roles also count for tickets | Read all pages and settings, including what the inboxes contain. Reply to and close tickets, decide ban appeals, applications and suggestions |
| **View** | The View roles | Read the pages, lists and settings. Change nothing |

Someone who has more than one level gets the highest one.

## Setting the roles

Open the server's **Settings** page and find **Dashboard access**. It has one
role field for each level.

- **Edit** is the list of bot-master roles. Only the server owner or someone with
  Manage Server can change this list. For everyone else the field is locked.
- **Inbox** and **View** can be changed by anyone with Edit access, and they are
  saved together with the rest of the page.

Changes to these roles are written to the audit log.

If you run Sylo with `INTENT_GUILD_MEMBERS=false`, Sylo asks Discord for a
member's roles before it decides their access, because the bot is not told when
roles change. See [Dashboard authentication](/self-hosting/discord/#dashboard-authentication).

## What a limited level looks like

A person with **View** or **Inbox** access sees a small **View only** or
**Inbox only** label in the top bar. Forms are read-only and their buttons are
disabled, with a note saying why. If a request still gets through to the server
above the person's level, Sylo refuses it with a "forbidden" error. The message
names only the person's own level (for example "Your dashboard access in this
server is View only"); the level the action needed is in the error's details.

- **What the inboxes contain needs Inbox.** With View, the lists of tickets,
  ban appeals, applications and suggestions still show, but without the content:
  no ticket preview, no appeal answers or decision reason, no application
  reasons, and the author of an anonymous suggestion stays hidden.
- **Secrets need Edit.** GitHub webhook secrets and addresses are hidden, RSS
  feed addresses show only their host, and the configuration export and the
  server insights refresh are Edit only.
- **Import and Duplicate need Edit.** Import never carries the dashboard access
  roles from one server to another.
- **Ticket notifications** go to Inbox and Edit members and to ticket staff only.

## What Sylo refuses to hand out

Sylo 5.2 also closes the ways a person could use the dashboard to give out more
than they have themselves.

- **Roles above your own.** Unless you are the server owner or have
  Administrator, you cannot make Sylo give a role that sits at or above your
  highest role, and you need Manage Roles to hand out a role with moderator or
  administrator permissions (Manage Server, Manage Roles, Kick, Ban and the
  like). Only the owner or someone with Manage Server can hand out an Edit role
  (a bot-master role). This holds everywhere a role is handed out: reaction roles and role panels, welcome
  and level rewards, the Economy shop, Events, Applications, and when you
  re-publish, move, enable or import something. A role Sylo itself cannot give
  (above its own highest role, or managed by an integration) is marked in the
  role picker.
- **Applications.** Nobody can accept their own application. The person who
  decides must be allowed to hand out every role the decision gives, and none of
  those roles may give more dashboard access than they have.
- **Ban appeals.** With Inbox access, accepting an appeal (which lifts the ban)
  also needs the Ban Members permission.
- **Role pings.** A published message pings a role only if you could ping that
  role yourself: you are the server owner, or have Manage Server or Mention
  Everyone, or the role is mentionable. A role that was shown in the text but not
  pinged is reported after publishing. A message with role buttons or menus can
  only be published by someone who may hand out every one of those roles.

## Privacy changes

- `/mydata` no longer shows the identities of staff members.
- `/forget` and account deletion had gaps in what they removed; those are fixed.
  What stays is deliberate: moderation cases, an active temporary ban, honeypot
  catches and a counting penalty. See the privacy policy for the full list.
- On Fluxer, a private reply that has content in it (for example a member's
  moderation history, a private quote, the event list or a data export) is sent
  as a direct message. A short status or error line is still a normal message
  that Sylo deletes after about 15 seconds.
