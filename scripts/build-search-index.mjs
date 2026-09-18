// Copyright (c) ZeroC, Inc.
//
// Build the search index the header's search palette loads.
//
//   node scripts/build-search-index.mjs
//
// One JSON file per (version, language) under `public/search/`, so the browser
// only ever downloads the manual the reader is actually in — a C++ reader never
// pays for the eight other language mappings. Runs from `prebuild`/`predev`; the
// output is generated, and git-ignored.
//
// A record is one page. Its headings are folded into a keyword blob rather than
// becoming records of their own: it keeps the index small while still matching
// the thing readers actually search for (`Ice.Default.Locator`, `AMI`).

import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

import {
  listVersions,
  listSlugs,
  readNavigationYaml
} from '../lib/docs-model/content.ts';
import { pageHref, trailTo } from '../lib/docs-model/nav.ts';
import { FRONTMATTER_RE, splitLines } from '../lib/docs-model/resolve.ts';

const ROOT = path.join(process.cwd(), 'content');
const OUT = path.join(process.cwd(), 'public', 'search');

/** Frontmatter fields plus the body, without pulling in a YAML parse per page. */
function readPage(file) {
  if (!fs.existsSync(file)) return null;
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
function crumbFor(nav, slug) {
  const trail = trailTo(nav.sidebar ?? [], slug);
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
  const nav = yamlLoad(readNavigationYaml(ROOT, version) ?? '');
  if (!nav) continue;

  const base = path.join(ROOT, version);
  const slugs = listSlugs(ROOT, version);

  for (const language of nav.languages ?? []) {
    const pages = [];
    for (const slug of slugs) {
      const shared = readPage(path.join(base, 'shared', `${slug}.md`));
      const overlay = readPage(
        path.join(base, 'languages', language, `${slug}.md`)
      );
      if (!shared && !overlay) continue; // not part of this language's manual

      const page = shared ?? overlay;
      const body = `${shared?.body ?? ''}\n${overlay?.body ?? ''}`;
      pages.push({
        t: page.title ?? slug,
        d: page.description ?? '',
        c: crumbFor(nav, slug),
        k: page.type ?? '',
        h: pageHref(version, language, slug === nav.landing ? undefined : slug),
        // De-duplicated headings, capped: enough to match on, small enough to ship.
        x: [...new Set(headings(body))].slice(0, 40).join(' · ')
      });
    }

    const file = path.join(OUT, version, `${language}.json`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ version, language, pages }));
    files++;
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`  ${version}/${language}: ${pages.length} pages (${kb} kB)`);
  }
}

console.log(`search index: ${files} file(s) under public/search`);
