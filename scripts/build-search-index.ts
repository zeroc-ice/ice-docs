// Copyright (c) ZeroC, Inc.
//
// Build the search index the header's search palette loads.
//
//   node scripts/build-search-index.ts
//
// One JSON file per version under `public/search/`. Runs from
// `prebuild`/`predev`; the output is generated, and git-ignored.
//
// A record is one page. Its headings are folded into keyword blobs rather than
// becoming records of their own: it keeps the index small while still matching
// the thing readers actually search for (`Ice.Default.Locator`, `AMI`). The
// shared text's headings match for every reader, and each mapping's own match
// only for that mapping's readers, who are the only ones to see them.

// cspell:words predev

import fs from 'node:fs';
import path from 'node:path';

import {
  listPages,
  readNavigation,
  readPageSources,
  writtenFor
} from '../lib/docs-model/content.ts';
import { ICE_VERSIONS } from '../app/ice/versions.ts';
import { pageHref, trailTo, type NavDoc } from '../lib/docs-model/nav.ts';
import { splitFrontmatter, splitLines } from '../lib/docs-model/resolve.ts';

const OUT = path.join(process.cwd(), 'public', 'search');

/** Heading text in a markdown body, skipping fenced code. */
function headings(body: string): string[] {
  const out: string[] = [];
  let fence: { char: string; length: number } | null = null;
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
    // resolve backslash escapes so `C\#` is searchable as C#, and drop the
    // `{% id="…" %}` that gives a heading its own anchor.
    if (heading)
      out.push(
        heading[1]
          .replace(/\{%.*?%\}/g, '')
          .replace(/[*_`[\]]/g, '')
          .replace(/\\(.)/g, '$1')
          .trim()
      );
  }
  return out;
}

/** Where a page sits, for the result's context line: "The Slice Language › User-Defined Types". */
function crumbFor(nav: NavDoc, slug: string): string {
  const trail = trailTo(nav.sidebar, slug);
  return trail
    ? trail
        .slice(0, -1)
        .map((node) => node.title)
        .join(' › ')
    : '';
}

let files = 0;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const version of ICE_VERSIONS) {
  const nav = readNavigation(version);

  const records: object[] = [];
  for (const page of listPages(version)) {
    const { shared, overlays, frontmatter } = readPageSources(page);
    const common = new Set(
      headings(shared ? splitFrontmatter(shared).body : '')
    );
    records.push({
      t: frontmatter.title,
      d: frontmatter.description ?? '',
      c: crumbFor(nav, page.slug),
      k: frontmatter.type ?? '',
      h: pageHref(version, page.slug),
      x: [...common].join(' · '),
      l: Object.fromEntries(
        Object.entries(overlays).map(([language, source]) => [
          language,
          [...new Set(headings(splitFrontmatter(source).body))]
            .filter((heading) => !common.has(heading))
            .join(' · ')
        ])
      ),
      w: writtenFor(page, frontmatter)
    });
  }

  const file = path.join(OUT, `${version.path}.json`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    JSON.stringify({ version: version.path, pages: records })
  );
  files++;
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`  ${version.path}: ${records.length} pages (${kb} kB)`);
}

console.log(`search index: ${files} file(s) under public/search`);
