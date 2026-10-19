// Import Sylo's docs/self-hosting.md as /self-hosting/discord/. The manual
// anchor TOC is dropped (Starlight renders its own "On this page" from the
// headings) and links are rewritten by lib/sylo-import.mjs — links to other
// imported docs (Fluxer, Postgres, the app, modules) go to their pages here,
// anything else to the file on GitHub.
//
// Re-run after a change in the Sylo repo: `npm run import` (or this file alone).
import { importStandalone, listModuleDocs } from './lib/sylo-import.mjs';

listModuleDocs(); // registers the module pages so links to them resolve
importStandalone('self-hosting/discord');
