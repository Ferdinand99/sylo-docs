---
title: Reaction roles & autoroles
description: Self-assign roles from a message; roles automatically on join.
---

<!-- Generated from Sylo's docs/modules/roles.md by scripts/ — edit it there and re-run `npm run import`. -->

Two features in one module:

- **Autoroles** — roles assigned automatically when a member joins.
- **Reaction roles** — a posted message members use to self-assign roles, via
  buttons or a select menu (Sylo uses interactions, not raw reactions).

**Dashboard:** `/guilds/<id>/m/roles`.

## Needs

- **Manage Roles**, with Sylo's role above every role it hands out.
- **Server Members** intent (`INTENT_GUILD_MEMBERS`) for autoroles.

## Settings

- **Autoroles** — a role list; also editable from the [Welcome](/modules/welcome/)
  page's "Give roles to new members".
- **Reaction-role messages** — each has a channel, an embed, a style
  (buttons or a select menu), whether it's exclusive (one role at a time), and a
  list of role + label (+ emoji) pairs.

## Notes

- Editing a reaction-role message re-posts or edits it in place.
- Managed roles (bot roles, Nitro booster, etc.) can't be assigned and are
  dropped from the picker.
