---
title: Ban appeals
description: DM banned members an appeal form; staff decide from the dashboard.
---

<!-- Generated from Sylo's docs/modules/appeals.md by scripts/ — edit it there and re-run `npm run import`. -->

When Sylo bans a member (via `/ban` or a warning auto-action), it DMs them a link
to an appeal form. Staff read submissions and accept or deny them from the
dashboard.

**Dashboard:** `/v2/guilds/<id>/appeals`.

## Needs

- **Ban Members** (to lift a ban on accept).
- A reachable `DASHBOARD_URL` — the appeal form is served at
  `<DASHBOARD_URL>/appeal/<token>`.
- No privileged intents.

## Settings

- **Questions** — 1–5 prompts shown on the appeal form, each one a single line.
  In the dashboard you can move a question up or down and remove it, and the
  boxes grow to show a long question in full.
- **Auto-unban on accept** — lift the ban automatically when an appeal is
  accepted (otherwise staff unban manually).

## How it works

The pre-ban DM carries the appeal link (this replaces Sylo's plain "you were
banned" notice). The member fills in the form once. On the **Ban appeals** page,
staff **Accept** or **Deny** with a reason; the member is DM'd the decision (and,
on accept, a rejoin invite) — or sees it on the appeal link if there's no shared
server.

### Changing the questions while someone has the form open

The form remembers which questions it showed. If staff reorder, edit or remove
questions while a member is still writing, the member gets the form back with the
current questions and the note "The questions changed while you were writing —
please check your answers." Nothing is stored at that point. Answers stay only
under questions whose text is unchanged; a new or edited question comes back
empty, so an answer never ends up under the wrong question.
