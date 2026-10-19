// Import the rest of Sylo's standalone docs, same treatment as the Discord
// self-hosting guide (H1 -> frontmatter, manual TOC dropped, links rewritten
// by lib/sylo-import.mjs):
//
//   docs/fluxer.md        -> /self-hosting/fluxer/
//   docs/postgres.md      -> /self-hosting/postgres/
//   docs/mobile-app.md    -> /app/ios/
//   docs/dashboard-v2.md  -> /dashboard/v2/
//
// Re-run after a change in the Sylo repo: `npm run import` (or this file alone).
import { importStandalone, listModuleDocs } from './lib/sylo-import.mjs';

listModuleDocs(); // registers the module pages so links to them resolve
for (const slug of ['self-hosting/fluxer', 'self-hosting/postgres', 'app/ios', 'dashboard/v2']) {
  importStandalone(slug);
}
