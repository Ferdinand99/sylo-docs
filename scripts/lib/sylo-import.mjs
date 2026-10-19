// Shared helpers for the import scripts: where the Sylo repo is, which Sylo
// docs have a page on this site, and how a Sylo markdown file is turned into a
// Starlight page (H1 -> frontmatter, manual TOC dropped, links rewritten).
//
// Every page on this site that mirrors a Sylo doc is generated from it by one
// of the scripts next to this file — edit the doc in the Sylo repo, then
// re-run `npm run import`, never the generated .md here.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONTENT = join(DOCS_ROOT, 'src', 'content', 'docs');

// The Sylo repo: $SYLO_REPO, or a "Sylo" checkout next to this one
// (C:\Users\ferdi\Desktop\Sylo next to C:\Users\ferdi\Desktop\sylo-docs).
export const SYLO_REPO = resolve(process.env.SYLO_REPO || join(DOCS_ROOT, '..', 'Sylo'));
if (!existsSync(join(SYLO_REPO, 'docs', 'modules'))) {
  throw new Error(`Sylo repo not found at ${SYLO_REPO} — set SYLO_REPO to its path`);
}

const GITHUB_BLOB = 'https://github.com/Ferdinand99/Sylo/blob/main/';
const GITHUB_RAW = 'https://raw.githubusercontent.com/Ferdinand99/Sylo/main/';

// Sylo repo file (posix path from the repo root) -> page on this site.
// Module docs are added by addModulePages() below. Anything in the Sylo repo
// that isn't in this map is linked to on GitHub instead.
export const STANDALONE_PAGES = [
  {
    src: 'docs/self-hosting.md',
    slug: 'self-hosting/discord',
    title: 'Self-host on Discord',
    description:
      'Install, configure, reverse-proxy, back up and upgrade a self-hosted Sylo — the bot and the dashboard in one container.',
  },
  {
    src: 'docs/fluxer.md',
    slug: 'self-hosting/fluxer',
    title: 'Sylo on Fluxer',
    description:
      'Run Sylo on Fluxer, alone or next to Discord in the same process: setup, dashboard login, chat commands and what works differently.',
  },
  {
    src: 'docs/postgres.md',
    slug: 'self-hosting/postgres',
    title: 'Postgres (optional)',
    description:
      'The opt-in Postgres backend for hosted-scale installs: enabling it, migrating from SQLite, backups and rolling back.',
  },
  {
    src: 'docs/mobile-app.md',
    slug: 'app/ios',
    title: 'The Sylo app',
    description:
      'Sylo – Server Manager for iPhone: what a self-hosted instance needs, how sign-in works, tokens, permissions and notifications.',
  },
  {
    src: 'docs/dashboard-v2.md',
    slug: 'dashboard/v2',
    title: 'Dashboard V2',
    description:
      'The rebuilt, opt-in dashboard at /v2: trying it, what is different, saving, and what self-hosters need.',
  },
  {
    src: 'docs/modules/README.md',
    slug: 'modules',
    title: 'Modules',
    description: 'Every Sylo module at a glance — what it does, whether it is on by default, and the privileged intents it needs.',
  },
];

const pageBySrc = new Map(STANDALONE_PAGES.map((p) => [p.src, p]));

/** Register docs/modules/<id>.md -> /modules/<id>/ for every imported module. */
export function addModulePages(modules) {
  for (const m of modules) {
    pageBySrc.set(`docs/modules/${m.id}.md`, { src: `docs/modules/${m.id}.md`, slug: `modules/${m.id}`, title: m.title });
  }
}

export function readSylo(relPath) {
  // Normalise CRLF so a Windows checkout produces the same output as a Mac one.
  return readFileSync(join(SYLO_REPO, relPath), 'utf8').replace(/\r\n?/g, '\n');
}

/** Split "# Title\n\nbody" into { title, body }. */
export function splitH1(raw, file) {
  const m = raw.match(/^# (.+)\n+/);
  if (!m) throw new Error(`no leading "# Title" in ${file}`);
  return { title: m[1].trim(), body: raw.slice(m[0].length) };
}

/**
 * Drop a hand-written anchor TOC (a run of "- [..](#..)" items before the first
 * "## " heading) and a "---" rule right after it: Starlight renders its own
 * "On this page" sidebar from the headings. Items that link to another file
 * (e.g. "- [Running on Fluxer](fluxer.md) (separate page)") inside the run go too.
 */
export function stripToc(body) {
  const lines = body.split('\n');
  const firstH2 = lines.findIndex((l) => l.startsWith('## '));
  const limit = firstH2 === -1 ? lines.length : firstH2;
  const start = lines.findIndex((l, i) => i < limit && /^- \[[^\]]+\]\(#[^)]+\)/.test(l));
  if (start === -1) return body;
  let end = start;
  while (end < limit && /^- \[[^\]]+\]\([^)]+\)/.test(lines[end])) end++;
  while (end < limit && lines[end].trim() === '') end++;
  if (lines[end]?.trim() === '---') {
    end++;
    while (end < limit && lines[end].trim() === '') end++;
  }
  lines.splice(start, end - start);
  return lines.join('\n');
}

const posixJoin = (base, rel) => {
  const parts = base ? base.split('/') : [];
  for (const seg of rel.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (!parts.length) return null; // escapes the repo
      parts.pop();
    } else parts.push(seg);
  }
  return parts.join('/');
};

// Link text that is just a file name ("docs/postgres.md", "`docs/modules/`",
// "self-hosting.md") reads oddly on a website — use the page title instead.
const FILENAME_TEXT = /^`?(?:\.\.\/)*(?:docs\/)?[\w./-]*(?:\.md|\/)`?$/;

/**
 * Rewrite relative links in `body` (from Sylo file `srcFile`) outside code:
 * a Sylo doc with a page here -> "/<slug>/#anchor"; any other repo file ->
 * its GitHub URL. Absolute URLs, "#anchor" and "/path" links stay as they are.
 * Returns { body, rewritten: [[from, to], ...] }.
 */
export function rewriteLinks(body, srcFile) {
  const baseDir = srcFile.split('/').slice(0, -1).join('/');
  const rewritten = [];
  const rewriteChunk = (text) => {
    // Ranges of inline code spans: a "](" inside one is not a link. (A link
    // whose *label* is inline code, [`docs/modules/`](..), still matches —
    // its "](" sits after the closing backtick.)
    const code = [];
    for (const m of text.matchAll(/(`+)[^`][\s\S]*?\1/g)) code.push([m.index, m.index + m[0].length]);
    const inCode = (i) => code.some(([a, b]) => i >= a && i < b);
    return text.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (all, bang, label, target, titleAttr, at) => {
      if (inCode(at + bang.length + label.length + 1)) return all;
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) return all;
      const hashAt = target.indexOf('#');
      const path = hashAt === -1 ? target : target.slice(0, hashAt);
      const anchor = hashAt === -1 ? '' : target.slice(hashAt);
      const repoPath = posixJoin(baseDir, decodeURI(path));
      if (repoPath === null) {
        console.warn(`  ! ${srcFile}: link escapes the repo, left as is: ${target}`);
        return all;
      }
      const page = bang ? null : pageBySrc.get(repoPath);
      let to;
      if (page) {
        to = `/${page.slug}/` + anchor;
        if (FILENAME_TEXT.test(label.trim()) && page.title) label = page.title;
      } else {
        to = (bang ? GITHUB_RAW : GITHUB_BLOB) + encodeURI(repoPath) + anchor;
      }
      rewritten.push([target, to]);
      return `${bang}[${label}](${to}${titleAttr})`;
    });
  };

  // Leave fenced code blocks alone.
  const out = [];
  let inFence = false;
  let buf = [];
  const flush = () => {
    if (buf.length) out.push(inFence ? buf.join('\n') : rewriteChunk(buf.join('\n')));
    buf = [];
  };
  for (const line of body.split('\n')) {
    const fence = /^\s*(```|~~~)/.test(line);
    if (fence && !inFence) {
      flush();
      inFence = true;
      buf.push(line);
    } else if (fence && inFence) {
      buf.push(line);
      flush();
      inFence = false;
    } else buf.push(line);
  }
  flush();
  return { body: out.join('\n'), rewritten };
}

function yamlString(s) {
  // Plain YAML scalar unless something in it would be read as YAML syntax.
  return /: |\s#|:$|^[\s&*!|>%@`'"\[\]{},?#:-]|\s$/.test(s) ? JSON.stringify(s) : s;
}

export function frontmatter(fields) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fields)) if (v != null) lines.push(`${k}: ${yamlString(v)}`);
  lines.push('---', '');
  return lines.join('\n');
}

export const GENERATED_NOTE = (src) =>
  `<!-- Generated from Sylo's ${src} by scripts/ — edit it there and re-run \`npm run import\`. -->\n`;

/** Write a page: frontmatter + generated-from note + body (trailing newline). */
export function writePage(slug, fields, src, body) {
  const file = join(CONTENT, `${slug === 'modules' ? 'modules/index' : slug}.md`);
  mkdirSync(dirname(file), { recursive: true });
  const text = frontmatter(fields) + '\n' + GENERATED_NOTE(src) + '\n' + body.replace(/\s+$/, '') + '\n';
  writeFileSync(file, text);
  return file;
}

/**
 * Every docs/modules/<id>.md in the Sylo repo (README.md excluded), with its
 * H1 as title — and registered as a page, so links to it resolve on this site.
 */
export function listModuleDocs() {
  const dir = join(SYLO_REPO, 'docs', 'modules');
  const modules = readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .map((f) => {
      const src = `docs/modules/${f}`;
      return { id: f.slice(0, -3), src, ...splitH1(readSylo(src), src) };
    });
  addModulePages(modules);
  return modules;
}

/** Import one STANDALONE_PAGES entry; returns the written file. */
export function importStandalone(slug, transform = (b) => b) {
  const page = STANDALONE_PAGES.find((p) => p.slug === slug);
  const { body: raw } = splitH1(readSylo(page.src), page.src);
  const { body, rewritten } = rewriteLinks(stripToc(transform(raw)), page.src);
  const file = writePage(page.slug, { title: page.title, description: page.description }, page.src, body);
  logResult(file, rewritten);
  return file;
}

export function logResult(file, rewritten) {
  console.log(`wrote ${file.slice(DOCS_ROOT.length + 1).replaceAll('\\', '/')}`);
  for (const [from, to] of rewritten) console.log(`    ${from} -> ${to}`);
}
