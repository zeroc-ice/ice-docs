// Copyright (c) ZeroC, Inc.
//
// Build the search index the header's search palette loads.
//
//   node scripts/build-search-index.mjs
//
// One JSON file per version under `public/search/`. Runs from
// `prebuild`/`predev`; the output is generated, and git-ignored.
//
// A record is one page. Its headings are folded into a keyword blob rather than
// becoming records of their own: it keeps the index small while still matching
// the thing readers actually search for (`Ice.Default.Locator`, `AMI`).

import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

import {
  listVersions,
  listPages,
  readNavigationYaml
} from '../lib/docs-model/content.ts';
import { pageHref, trailTo } from '../lib/docs-model/nav.ts';
import { FRONTMATTER_RE, splitLines } from '../lib/docs-model/resolve.ts';

const ROOT = path.join(process.cwd(), 'content', 'ice');
const OUT = path.join(process.cwd(), 'public', 'search');

/** Frontmatter fields plus the body, without pulling in a YAML parse per page. */
function readPage(file) {
  if (!file) return null;
  const source = fs.readFileSync(file, 'utf8');
  const m = FRONTMATTER_RE.exec(source);
  const frontmatter = m ? m[1] : '';
  const field = (name) => {
    const found = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(frontmatter);
    return found ? found[1].trim().replace(/^["']|["']$/g, '') : undefined;
  };
  return {
    title: field('title'),
    description: field('description'),
    type: field('type'),
    body: m ? source.slice(m[0].length) : source
  };
}

/** Heading text in a markdown body, skipping fenced code. */
function headings(body) {
  const out = [];
  let fence = null;
  for (const line of splitLines(body)) {
    const delimiter = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (delimiter) {
      const [char, length] = [delimiter[1][0], delimiter[1].length];
      if (!fence) fence = { char, length };
      else if (char === fence.char && length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    const heading = /^#{1,6}\s+(.+?)\s*(?<!\\)#*$/.exec(line);
    // Strip inline markdown so `**Ice.Default.Locator**` is searchable as text,
    // and resolve backslash escapes so `C\#` is searchable as C#.
    if (heading)
      out.push(
        heading[1]
          .replace(/[*_`[\]]/g, '')
          .replace(/\\(.)/g, '$1')
          .trim()
      );
  }
  return out;
}

/** Where a page sits, for the result's context line: "The Slice Language › User-Defined Types". */
function crumbFor(nav, page) {
  const trail = trailTo(nav.sidebar ?? [], page);
  return trail
    ? trail
        .slice(0, -1)
        .map((node) => node.title)
        .join(' › ')
    : '';
}

let files = 0;
fs.rmSync(OUT, { recursive: true, force: true });

for (const version of listVersions(ROOT)) {
  const nav = yamlLoad(readNavigationYaml(ROOT, version));

  const records = [];
  for (const page of listPages(ROOT, version)) {
    const shared = readPage(page.shared);
    const overlays = Object.values(page.overlays).map(readPage);
    const fm = shared ?? overlays[0];
    const body = [shared, ...overlays].map((p) => p?.body ?? '').join('\n');
    records.push({
      t: fm.title ?? page.name,
      d: fm.description ?? '',
      c: crumbFor(nav, page.name),
      k: fm.type ?? '',
      h: pageHref(version, page.slug),
      // Every mapping's headings, de-duplicated.
      x: [...new Set(headings(body))].join(' · '),
      // The languages a page written per language is for; every language otherwise.
      ...(shared ? {} : { w: Object.keys(page.overlays) })
    });
  }

  const file = path.join(OUT, `${version}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ version, pages: records }));
  files++;
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`  ${version}: ${records.length} pages (${kb} kB)`);
}

console.log(`search index: ${files} file(s) under public/search`);
