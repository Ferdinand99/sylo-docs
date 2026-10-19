---
title: Server statistics
description: Voice channels named with live member/role/boost counts.
---

<!-- Generated from Sylo's docs/modules/server-stats.md by scripts/ — edit it there and re-run `npm run import`. -->

Keeps voice-channel names updated with live counts — total members, humans, bots,
a role's member count, or the boost count. MEE6-style "stat channels".

**Dashboard:** `/guilds/<id>/m/server-stats`.

## Needs

- **Manage Channels** (to rename), **Connect** on the stat channels (so they
  render), and ideally lock them so members can't join.
- **Server Members** intent (`INTENT_GUILD_MEMBERS`) for accurate member counts.

## Settings

- **Refresh interval** — minutes between updates (Discord rate-limits channel
  renames hard; keep it generous — 10+ minutes).
- **Channels** — each maps a voice channel to a metric and a name template
  (e.g. `Members: {count}`).

## Notes

- Discord allows roughly two renames per channel per 10 minutes; the module
  spaces updates accordingly.
