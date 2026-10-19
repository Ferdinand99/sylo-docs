# Sylo docs

Documentation site for [Sylo](https://github.com/Ferdinand99/Sylo), the bot for
Discord and Fluxer (one bot, one container, since Sylo 4.0) — built with
[Astro Starlight](https://starlight.astro.build). Deployed at
[docs.sylobot.com](https://docs.sylobot.com).

## Content

Almost every page is **generated** from a doc in the Sylo repo, which stays the
single source of truth. Don't edit the generated `.md` files here (each one
starts with a `<!-- Generated from Sylo's … -->` note) — change the doc in the
Sylo repo and re-import.

| Page | Generated from (Sylo repo) | Script |
|---|---|---|
| `/self-hosting/discord/` | `docs/self-hosting.md` | `scripts/import-self-hosting-discord.mjs` |
| `/self-hosting/fluxer/` (Sylo on Fluxer) | `docs/fluxer.md` | `scripts/import-pages.mjs` |
| `/self-hosting/postgres/` | `docs/postgres.md` | `scripts/import-pages.mjs` |
| `/app/ios/` (the Sylo app) | `docs/mobile-app.md` | `scripts/import-pages.mjs` |
| `/dashboard/v2/` | `docs/dashboard-v2.md` | `scripts/import-pages.mjs` |
| `/modules/` (overview) | `docs/modules/README.md` | `scripts/import-modules.mjs` |
| `/modules/<id>/` | `docs/modules/<id>.md` | `scripts/import-modules.mjs` |

Hand-written: only the home page, `src/content/docs/index.mdx`.

- `honeypot` has no page because `docs/modules/honeypot.md` doesn't exist in
  the Sylo repo yet. Once it does, the module import picks it up; add it to
  the sidebar in `astro.config.mjs` (`moduleGroups`).
- Privacy policy and terms of service are **not** mirrored here — they stay
  linked out to the Sylo repo directly (see the sidebar's Legal group) so
  there's only one copy of legally-significant text to keep current.

## Updating after a change in the Sylo repo

```bash
npm run import   # runs all three import scripts
git status       # review what changed before committing
```

The scripts expect the Sylo repo checked out next to this one (`../Sylo`); set
`SYLO_REPO=/path/to/Sylo` otherwise. They read the working tree, so check out
`main` there (or whichever branch you're documenting) first.

What the import does to each doc (shared code in `scripts/lib/sylo-import.mjs`):

- The leading `# Title` becomes Starlight frontmatter (Starlight renders the
  title itself). Standalone pages get the title and description set in
  `STANDALONE_PAGES`; module pages keep their H1 as title and take their
  description from the module's row in `docs/modules/README.md`.
- A hand-written anchor TOC at the top is dropped — Starlight builds its own
  "On this page" from the headings.
- Line endings are normalised to LF.
- **Links are rewritten** (relative `.md` links don't resolve under
  Starlight's routing): a link to a Sylo doc that has a page here becomes that
  page's absolute path (`fluxer.md#dashboard-login` →
  `/self-hosting/fluxer/#dashboard-login`); a link to any other file in the
  Sylo repo (`privacy-policy.md`, `../../README.md`, `src/…`) becomes its
  `https://github.com/Ferdinand99/Sylo/blob/main/…` URL. Link text that is just
  a file name (`docs/postgres.md`) is replaced with the page title. Code
  blocks and inline code are left alone. Each rewritten link is printed.
- A module page whose Sylo doc was deleted is removed.

To mirror another Sylo doc: add it to `STANDALONE_PAGES` in
`scripts/lib/sylo-import.mjs` (so links to it resolve everywhere), import it
in `scripts/import-pages.mjs`, and add it to the sidebar in `astro.config.mjs`.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve the production build locally
```

If a build shows content you've already changed, clear Astro's caches first:
`rm -rf node_modules/.astro .astro/data-store.json dist`.

## Deployment

Static output (`dist/`) — deployed the same way as
[sylobot.com](https://github.com/Ferdinand99/Sylo)'s marketing site: build,
then copy `dist/` onto the host and serve it with nginx.
