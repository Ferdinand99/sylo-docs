# Sylo docs

Documentation site for [Sylo](https://github.com/Ferdinand99/Sylo) (Discord) and
[Sylo-Fluxer](https://github.com/Ferdinand99/Sylo-Fluxer) (Fluxer) — built with
[Astro Starlight](https://starlight.astro.build). Deployed at
[docs.sylobot.com](https://docs.sylobot.com).

## Content

- `src/content/docs/self-hosting/` — the self-hosting guides for each platform.
  `discord.md` is a copy of `docs/self-hosting.md` from the Sylo repo (imported
  with `scripts/import-self-hosting-discord.mjs`); `fluxer.md` is hand-written
  from Sylo-Fluxer's own README "Self-hosting" section plus a link back to the
  Discord guide's shared operational sections (reverse proxy, backups,
  upgrades, troubleshooting).
- `src/content/docs/modules/` — one page per module, imported as-is from the
  Sylo repo's `docs/modules/*.md` with `scripts/import-modules.mjs` (strips
  the leading `# Title` into Starlight frontmatter). Re-run that script to
  pick up changes made in the Sylo repo. `honeypot` is missing a page because
  `docs/modules/honeypot.md` doesn't exist in the Sylo repo yet.
- Privacy policy and terms of service are **not** mirrored here — they stay
  linked out to the Sylo repo directly (see the sidebar's Legal group) so
  there's only one copy of legally-significant text to keep current.

## Updating module docs after a change in the Sylo repo

```bash
node scripts/import-modules.mjs
git status   # review what changed before committing
```

The script only touches `docs/modules/*.md` → `src/content/docs/modules/*.md`
verbatim (minus the H1). If a module doc gains an internal link to another
module doc, fix it to an absolute `/modules/<slug>/` path by hand afterwards —
see the existing fixes in `autoresponder.md`, `roles.md`, `welcome.md` and
`welcome-channel.md` for the pattern (relative `.md` links don't resolve
under Starlight's routing).

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve the production build locally
```

## Deployment

Static output (`dist/`) — deployed the same way as
[sylobot.com](https://github.com/Ferdinand99/Sylo)'s marketing site: build,
then copy `dist/` onto the host and serve it with nginx.
