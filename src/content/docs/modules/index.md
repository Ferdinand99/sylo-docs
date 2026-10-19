---
title: Modules
description: Every Sylo module at a glance — what it does, whether it is on by default, and the privileged intents it needs.
---

<!-- Generated from Sylo's docs/modules/README.md by scripts/ — edit it there and re-run `npm run import`. -->

Every Sylo feature is a **module** — toggled and configured per server from the
dashboard (`/guilds/<id>/m/<module>`), like MEE6 or Dyno plugins. Modules are
**off by default** unless noted; enable them on the module's page.

Each page below lists what the module does, the Discord permissions and gateway
intents it needs, its settings, and any slash commands.

On [Fluxer](/self-hosting/fluxer/) every module works per server in the same way. Commands there
run from chat (`!command`) instead of `/command`, and buttons show as reactions. The
page [What works differently](/self-hosting/fluxer/#what-works-differently) lists the few
platform gaps (native AutoMod rules, threads, moving members between voice).

| Module | What it does | Default | Privileged intents |
|---|---|---|---|
| [Moderation](/modules/moderation/) | Warnings, warning auto-actions, mod-log, ban/lock tools | **on** | — |
| [Auto-moderation](/modules/automod/) | Filter invites, links, spam, caps, banned words | off | Message Content |
| [Server logging](/modules/logging/) | Send member/message/role/channel events to log channels | off | Server Members + Message Content |
| [Verification](/modules/verification/) | Gate new members behind a button or captcha | off | Server Members |
| [Ban appeals](/modules/appeals/) | DM banned members an appeal form; staff decide from the dashboard | off | — |
| [Tickets (modmail)](/modules/tickets/) | Members DM the bot; staff reply from the dashboard | off | — |
| [Welcome & leave](/modules/welcome/) | Greet joiners (with an optional image) and announce leavers | off | Server Members |
| [Welcome channel](/modules/welcome-channel/) | One rich pinned message for a read-only welcome channel | off | — |
| [Birthdays](/modules/birthdays/) | Members save a birthday; Sylo greets them and can grant a role | off | — |
| [Reaction roles & autoroles](/modules/roles/) | Self-assign roles from a message; roles automatically on join | off | Server Members |
| [Leveling](/modules/leveling/) | XP and levels from activity, role rewards, leaderboard | off | Server Members |
| [Invite tracker](/modules/invite-tracker/) | Track who invited each member; inviter leaderboard | off | Server Members |
| [Counting](/modules/counting/) | Members count upward one number at a time | off | Message Content |
| [Starboard](/modules/starboard/) | Re-post well-reacted messages into a highlights channel | off | Message Content |
| [Autoresponder](/modules/autoresponder/) | Auto-reply when a message matches a trigger | off | Message Content |
| [Auto-react](/modules/auto-react/) | Auto-react to messages from chosen users/roles, optionally change a role too | off | — |
| [Custom commands](/modules/custom-commands/) | Build `/slash` commands from an action list | off | — |
| [Reminders](/modules/reminders/) | Post a message to a channel once or on a schedule | off | — |
| [Sticky messages](/modules/sticky/) | Keep a message pinned to the bottom of a channel | off | — |
| [Polls](/modules/polls/) | Reaction polls that auto-close on a timer or vote cap | off | — |
| [Giveaways](/modules/giveaways/) | Prize giveaways with an Enter button; auto-drawn winners | off | — |
| [AFK](/modules/afk/) | Members mark themselves away; Sylo replies to mentions | off | — |
| [Temporary voice channels](/modules/temp-voice/) | Join-to-create voice hubs controlled with `/voice-*` | off | — |
| [Server statistics](/modules/server-stats/) | Voice channels named with live member/role/boost counts | off | Server Members |
| [Server insights](/modules/insights/) | Daily activity charts — messages, joins/leaves, top channels | off | — |
| [Twitch alerts](/modules/twitch-alerts/) | Announce when a Twitch streamer goes live | off | — |
| [YouTube alerts](/modules/youtube-alerts/) | Announce a channel's new uploads and going live | off | — |
| [Kick alerts](/modules/kick-alerts/) | Announce when a Kick.com streamer goes live | off | — |
| [RSS alerts](/modules/rss/) | Post new items from followed RSS / Atom feeds | off | — |
| [App Store Connect](/modules/apple-connect/) | Owner-only alerts for your Apple apps: review state, builds, reviews, TestFlight, certificate expiry (beta) | off | — |
| [Free games](/modules/free-games/) | Announce games free to claim on the Epic Games Store | off | — |
| [Game stats](/modules/game-stats/) | Battlefield-series player lookups via `/stats` | off | — |
| [Channel cleanup](/modules/channel-cleanup/) | Auto-delete old messages from a channel on a weekly schedule | off | — |
| [GitHub alerts](/modules/github/) | Post a repo's pushes, releases, issues and pull requests to a channel | off | — |

See also [Self-host on Discord](/self-hosting/discord/) for the privileged-intent env
vars and the bot's permission set.
