---
title: Self-host on Fluxer
description: Install and configure Sylo-Fluxer, the self-hosted beta port of Sylo to Fluxer.
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="Beta">
	Sylo-Fluxer runs on [Fluxer](https://fluxer.app) and every module has been ported, but it
	started life as a Discord bot and several features don't work as expected yet — see the
	[Beta status](https://github.com/Ferdinand99/Sylo-Fluxer#beta-status) section on GitHub before
	you rely on it. There's no hosted instance — self-host only, for now.
</Aside>

Sylo-Fluxer is Sylo rebuilt on the Fluxer SDK: the same 34 per-community modules, the same web
dashboard, and the same data model — with `!`-prefix commands instead of slash commands, and
reactions in place of buttons and menus, because Fluxer has neither yet.

## 1. Create the Fluxer application

In the Fluxer app open **User Settings → Developer → Applications** and create an application. You
need:

| Variable | Where |
| --- | --- |
| `FLUXER_TOKEN` | *Secrets & tokens* → Bot token |
| `FLUXER_CLIENT_ID` | *Application ID*, at the top of the page |

Invite the bot to your community with (replace the id):

```
https://web.fluxer.app/oauth2/authorize?client_id=YOUR_APPLICATION_ID&scope=bot&permissions=1100469103831
```

That permission set covers moderation, roles, channels, messages, moving members and timeouts. Put
the bot's role **above** the roles it should manage.

Every other variable is optional — see
[`.env.example`](https://github.com/Ferdinand99/Sylo-Fluxer/blob/main/.env.example). A self-hosted
Fluxer instance is supported via `FLUXER_API_URL` / `FLUXER_WEB_URL`.

## 2. Run it

With Docker Compose:

```bash
git clone https://github.com/Ferdinand99/Sylo-Fluxer.git
cd Sylo-Fluxer
cp .env.example .env      # set FLUXER_TOKEN and FLUXER_CLIENT_ID
docker compose up -d --build
```

The dashboard listens on port 3000. Until you set up dashboard login below it runs in **open
mode** — no login, full access for anyone who can reach it — so keep it on `localhost` or a
trusted LAN.

Or run the prebuilt multi-arch image (`linux/amd64` + `linux/arm64`) with the same `.env` and a
volume for `/app/data`:

| Tag | What it is |
| --- | --- |
| `ghcr.io/ferdinand99/sylo-fluxer:latest`, `:X.Y.Z`, `:X.Y` | Releases |
| `ghcr.io/ferdinand99/sylo-fluxer:main`, `:sha-<short>` | Rolling build of `main` |

## 3. Dashboard login

"Log in with Fluxer" restricts the dashboard to people who own or manage (Administrator or Manage
Server) a community the bot is in. Set it up before you expose the dashboard beyond your LAN:

1. In the same Fluxer application, copy *Secrets & tokens* → **Client secret**.
2. Add a **Redirect URI**: `<your dashboard URL>/auth/fluxer/callback`, e.g.
   `https://sylo.example.com/auth/fluxer/callback`. It must match exactly.
3. Set these in `.env` and restart:

| Variable | Value |
| --- | --- |
| `FLUXER_CLIENT_SECRET` | The client secret — turns login on |
| `DASHBOARD_URL` | The public URL, e.g. `https://sylo.example.com` |
| `SESSION_SECRET` | Any long random string, so sessions survive restarts (`openssl rand -hex 32`) |
| `OWNER_IDS` | Your Fluxer user id(s) — only they can open the Health page and its backups |

## Unraid

The Unraid template lives in
[Ferdinand99/unraid-templates](https://github.com/Ferdinand99/unraid-templates) together with
Sylo's. Search for **Sylo-Fluxer** in **Apps** (Community Applications); until it's listed there,
add `https://github.com/Ferdinand99/unraid-templates` under **Docker → Template repositories** and
pick it from **Add Container**. Keep the data directory on a real local disk (e.g.
`/mnt/cache/appdata/sylo-fluxer`), not `/mnt/user` — SQLite in WAL mode needs working file locks.
If you also run the Discord Sylo on the same server, the template already uses different names,
paths and ports.

## Reverse proxy, backups, upgrades and troubleshooting

These are shared with the Discord build — the operational side doesn't depend on which chat
platform Sylo talks to. See the matching sections of
**[Self-host on Discord](/self-hosting/discord/)**:
[behind a reverse proxy](/self-hosting/discord/#behind-a-reverse-proxy),
[backups](/self-hosting/discord/#backups),
[upgrades and rollback](/self-hosting/discord/#upgrades-and-rollback),
[SQLite on a network mount](/self-hosting/discord/#sqlite-on-a-network-mount), and
[troubleshooting](/self-hosting/discord/#troubleshooting) (skip the Discord-specific rows).

## Local development

Requires **Node.js 22+** and a Fluxer application (see above).

```bash
git clone https://github.com/Ferdinand99/Sylo-Fluxer.git
cd Sylo-Fluxer
npm install
cp .env.example .env     # set FLUXER_TOKEN and FLUXER_CLIENT_ID
npm test
npm run dev              # restarts on file changes
```

Only one process may use a bot token at a time — stop any other instance first, or the bot answers
every command twice.
