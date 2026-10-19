// Import Sylo's docs/modules/*.md into src/content/docs/modules/: one page
// per module (the leading "# Title" becomes Starlight frontmatter, since
// Starlight renders the title itself), plus docs/modules/README.md as the
// /modules/ overview. Each page's description is that module's "What it does"
// cell in the README table. Links are rewritten by lib/sylo-import.mjs.
//
// Re-run after a change in the Sylo repo: `npm run import` (or this file alone).
import { readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import {
  CONTENT,
  GENERATED_NOTE,
  importStandalone,
  listModuleDocs,
  logResult,
  readSylo,
  rewriteLinks,
  writePage,
} from './lib/sylo-import.mjs';

const modules = listModuleDocs();

// "| [Moderation](moderation.md) | Warnings, ... | **on** | — |" -> moderation: "Warnings, ..."
const descriptions = new Map();
for (const m of readSylo('docs/modules/README.md').matchAll(/^\| \[[^\]]+\]\(([\w-]+)\.md\) \| ([^|]+) \|/gm)) {
  descriptions.set(m[1], m[2].trim().replace(/`/g, '') + '.');
}

for (const m of modules) {
  if (!descriptions.has(m.id)) console.warn(`  ! ${m.id}: no row in docs/modules/README.md — page has no description`);
  const { body, rewritten } = rewriteLinks(m.body, m.src);
  const file = writePage(`modules/${m.id}`, { title: m.title, description: descriptions.get(m.id) }, m.src, body);
  logResult(file, rewritten);
}

importStandalone('modules');

// Drop pages whose Sylo doc is gone (only ones this script generated).
const dest = join(CONTENT, 'modules');
const keep = new Set([...modules.map((m) => `${m.id}.md`), 'index.md']);
const marker = GENERATED_NOTE('').slice(0, 30);
for (const f of readdirSync(dest)) {
  if (keep.has(f) || !f.endsWith('.md')) continue;
  if (readFileSync(join(dest, f), 'utf8').includes(marker)) {
    unlinkSync(join(dest, f));
    console.log(`removed modules/${f} (no longer in the Sylo repo)`);
  } else console.warn(`  ! modules/${f} has no Sylo source — left alone`);
}

console.log(`Imported ${modules.length} module docs + the overview.`);
