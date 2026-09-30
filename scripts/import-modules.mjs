// One-off import: copy Sylo's docs/modules/*.md into this project's
// src/content/docs/modules/, converting the leading "# Title" line into
// Starlight frontmatter (Starlight renders the title itself, so a
// duplicate H1 in the body would show twice).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'C:/Users/ferdi/Desktop/Sylo/docs/modules';
const DEST = 'C:/Users/ferdi/Desktop/sylo-docs/src/content/docs/modules';

mkdirSync(DEST, { recursive: true });

function frontmatterEscape(s) {
  return s.includes(':') || s.includes('"') ? JSON.stringify(s) : s;
}

for (const file of readdirSync(SRC)) {
  if (!file.endsWith('.md') || file === 'README.md') continue;
  const raw = readFileSync(join(SRC, file), 'utf8');
  const lines = raw.split('\n');
  const titleLine = lines[0];
  if (!titleLine.startsWith('# ')) {
    console.warn(`skip (no H1): ${file}`);
    continue;
  }
  const title = titleLine.slice(2).trim();
  // Drop the H1 and the blank line that follows it.
  const body = lines.slice(1).join('\n').replace(/^\n+/, '');
  const out = `---\ntitle: ${frontmatterEscape(title)}\n---\n\n${body}`;
  writeFileSync(join(DEST, file), out);
}

console.log(`Imported ${readdirSync(DEST).length} module docs.`);
