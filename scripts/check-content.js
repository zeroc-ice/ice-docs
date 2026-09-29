// Copyright (c) ZeroC, Inc.
//
// Structural checks over the content tree. Run with `npm run check:content`.
//
// These are the invariants that make the manual hold together; each one, when
// violated, produces a page a reader cannot reach or a link that goes nowhere:
//
//   1. every page is in the table of contents: listed by the page above it, up to the front page
//   2. no two pages share a name (cross-page links are keyed by it)
//   3. every overlay is for one of the manual's languages
//   4. every cross-page link resolves to a real page — checked by check:markdoc,
//      on each page as the site renders it
//   5. every image parses as an image, has alt text, and its file exists
//   6. no raw HTML or Confluence markup survived the migration
//   7. every language slot is answered, and says which kind of answer it is
//   8. a page written per language has one title across its languages
//   9. no page holds a no-break space (U+00A0)
//  10. under the title, the page's h1, each heading is at most one level below
//      the one before it, in every language, and none is bold text alone
//
// Exit code 1 on a violation of any of them — those are defects in the files
// themselves, and the tree is clean of them today, so anything new is a
// regression. The exception is a slot that doesn't say which kind of answer it
// is (7): many still don't, so those fail only when their count rises, or under
// --strict. A version without a front page, or a page that lists a page it does
// not contain, fails as the navigation is read.

// cspell:words noformat unparseable worklist

import fs from 'node:fs';
import path from 'node:path';
import Markdoc from '@markdoc/markdoc';

import { buildPageIndex } from '../lib/docs-model/links.ts';
import {
  declaredSlots,
  parseLanguageSections,
  resolveDocument,
  splitFrontmatter
} from '../lib/docs-model/resolve.ts';
import {
  CONTENT_ROOT,
  frontmatterOf,
  listVersions,
  listPages,
  readNavigation,
  readPageSources,
  snippetReader
} from '../lib/docs-model/content.ts';
import { navigationPages } from '../lib/docs-model/nav.ts';

const strict = process.argv.includes('--strict');
const PUBLIC = path.join(process.cwd(), 'public');

let errors = 0;
const fail = (message) => {
  console.error(`error: ${message}`);
  errors++;
};

// Images. The capture is deliberately loose — it matches the *intent* to write
// an image, including forms CommonMark will not parse, because those are exactly
// the ones that reach the page as visible `![...](...)` gibberish.
const IMAGE_RE = /!\[([^\]]*)\]\(([^)]*)\)/g;

// Block-level HTML and Confluence storage-format leftovers. Inline `<...>` in
// prose is usually a Slice or C++ generic (`sequence<int>`, `shared_ptr<T>`),
// so only tags that a converter emits are listed.
const STRAY_MARKUP = [
  {
    name: 'raw HTML block tag',
    re: /<\/?(?:div|table|tbody|thead|tr|td|th|p|span|br|hr|img)\b[^>]*>/gi
  },
  { name: 'Confluence storage markup', re: /<\/?(?:ac|ri):[a-z-]+/gi },
  {
    name: 'Confluence wiki macro',
    re: /\{(?:code|panel|noformat|info|note|warning|tip)(?::[^}]*)?\}/g
  },
  { name: 'HTML entity', re: /&(?:nbsp|amp|lt|gt|quot|#\d+);/g }
];

// Code samples are not prose: the IceGrid chapters are full of XML descriptors,
// and a `<node>` element inside a fence is the subject matter, not a migration
// artifact. Blank the fences (keeping line count) before scanning.
function withoutCode(source) {
  return source
    .replace(/^```[\s\S]*?^```/gm, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (span) => span.replace(/[^\n]/g, ' '));
}

// Where an image target should resolve on disk: site-absolute paths come out of
// `public/`, relative ones out of the page's own directory.
function imageFileFor(target, sourceFile) {
  const clean = decodeURI(target.split(/[?#]/)[0]);
  return clean.startsWith('/')
    ? path.join(PUBLIC, clean)
    : path.join(path.dirname(sourceFile), clean);
}

function checkImages(version, files) {
  const missing = new Map();
  let total = 0;

  for (const file of files) {
    const source = withoutCode(fs.readFileSync(file, 'utf8'));
    const relative = path.relative(process.cwd(), file);

    for (const [, alt, target] of source.matchAll(IMAGE_RE)) {
      total++;

      // Whitespace in the target stops CommonMark treating this as an image at
      // all: the reader gets the literal markup in the middle of a paragraph.
      if (/\s/.test(target)) {
        fail(
          `${relative}: image target contains whitespace, so it renders as text: "${target}"`
        );
        continue;
      }
      if (!target.trim()) {
        fail(`${relative}: image has an empty target`);
        continue;
      }
      // Alt text is the only thing a screen reader — or a reader whose image
      // failed to load — ever gets.
      if (!alt.trim()) {
        fail(`${relative}: image has no alt text: "${target}"`);
      }
      if (/^(?:https?:)?\/\//.test(target) || target.startsWith('data:'))
        continue;

      if (!fs.existsSync(imageFileFor(target, file))) {
        missing.set(target, (missing.get(target) ?? 0) + 1);
      }
    }
  }

  const missingCount = [...missing.values()].reduce((a, b) => a + b, 0);
  console.log(
    `${version}: ${total} images, ${missingCount} missing (${missing.size} distinct)`
  );
  if (missingCount) {
    for (const [target, count] of [...missing.entries()].slice(0, 10)) {
      console.log(`  ${String(count).padStart(4)}  ${target}`);
    }
    if (missing.size > 10) console.log(`  ...and ${missing.size - 10} more`);
    fail(`${version}: ${missingCount} images point at files that do not exist`);
  }
}

// The number of blank language sections that had no explanation when the slot
// states were introduced. It is a ratchet: classifying slots lowers it, and the
// check fails if it ever rises. When it reaches 0, delete this.
const UNCLASSIFIED_SLOT_BASELINE = 333;

/**
 * Every slot a shared page declares must be answered by each language overlay,
 * and the answer must say which kind of answer it is: prose, "this mapping adds
 * nothing", or "this mapping cannot do this, because…". A blank section says
 * none of those, and the reader cannot tell the three apart.
 */
function checkSlots(version, pages, languages) {
  const counts = {
    content: 0,
    'no-addition': 0,
    'not-applicable': 0,
    unclassified: 0
  };
  const perLanguage = Object.fromEntries(languages.map((l) => [l, 0]));
  // page name -> language -> slot names still blank, for the `--slots` worklist.
  const blanks = new Map();
  let missing = 0;
  let unused = 0;

  for (const page of pages) {
    if (!page.shared) continue;
    const slots = declaredSlots(
      splitFrontmatter(fs.readFileSync(page.shared, 'utf8')).body
    );
    if (slots.length === 0) continue;

    for (const language of languages) {
      const overlayPath = page.overlays[language];
      if (!overlayPath) {
        // The shared page asks for language-specific prose and none exists.
        missing += slots.length;
        fail(
          `${version}/${language}: "${page.name}" declares ${slots.length} slot(s) but has no overlay`
        );
        continue;
      }

      let sections;
      try {
        sections = parseLanguageSections(
          splitFrontmatter(fs.readFileSync(overlayPath, 'utf8')).body
        );
      } catch (error) {
        fail(
          `${version}/${language}: "${page.name}" overlay is malformed — ${error.message}`
        );
        continue;
      }

      for (const name of slots) {
        const slot = sections.get(name);
        if (!slot) {
          missing++;
          fail(
            `${version}/${language}: "${page.name}" has no section for slot "${name}"`
          );
          continue;
        }
        counts[slot.state]++;
        if (slot.state === 'unclassified') {
          perLanguage[language]++;
          if (!blanks.has(page.name)) blanks.set(page.name, new Map());
          const byLanguage = blanks.get(page.name);
          byLanguage.set(language, [...(byLanguage.get(language) ?? []), name]);
        }
      }
      // A section nobody asked for is dead content: it renders nowhere.
      for (const name of sections.keys()) {
        if (!slots.includes(name)) {
          unused++;
          fail(
            `${version}/${language}: "${page.name}" overlay defines unused section "${name}"`
          );
        }
      }
    }
  }

  // `--slots` prints the classification worklist, grouped so a reviewer can take
  // one page and answer it for every language at once.
  if (process.argv.includes('--slots') && blanks.size) {
    console.log('\nunclassified slots by page:');
    for (const [name, byLanguage] of [...blanks.entries()].sort()) {
      console.log(`  ${name}`);
      for (const [language, names] of [...byLanguage.entries()].sort()) {
        console.log(`    ${language.padEnd(7)} ${names.join(', ')}`);
      }
    }
    console.log('');
  }

  const classified =
    counts.content + counts['no-addition'] + counts['not-applicable'];
  console.log(
    `${version}: ${classified + counts.unclassified} language slots — ` +
      `${counts.content} content, ${counts['no-addition']} no-addition, ` +
      `${counts['not-applicable']} not-applicable, ${counts.unclassified} unclassified`
  );

  if (counts.unclassified) {
    const worst = Object.entries(perLanguage)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
    console.log(
      '  unclassified by language: ' +
        worst.map(([l, n]) => `${l} ${n}`).join(', ')
    );
  }

  if (counts.unclassified > UNCLASSIFIED_SLOT_BASELINE) {
    fail(
      `${version}: ${counts.unclassified} unclassified language slots, up from the ` +
        `baseline of ${UNCLASSIFIED_SLOT_BASELINE}. A blank section must declare ` +
        `state="no-addition" or state="not-applicable" note="…".`
    );
  } else if (counts.unclassified < UNCLASSIFIED_SLOT_BASELINE) {
    console.log(
      `  ${UNCLASSIFIED_SLOT_BASELINE - counts.unclassified} fewer than the baseline — ` +
        `lower UNCLASSIFIED_SLOT_BASELINE in scripts/check-content.js to ${counts.unclassified}`
    );
  }
  if (strict && counts.unclassified) {
    fail(
      `${version}: ${counts.unclassified} language slots do not say why they are blank`
    );
  }
  return { missing, unused };
}

function checkStrayMarkup(files) {
  for (const file of files) {
    const source = withoutCode(fs.readFileSync(file, 'utf8'));
    const relative = path.relative(process.cwd(), file);
    for (const { name, re } of STRAY_MARKUP) {
      const hits = [...source.matchAll(re)];
      if (hits.length) {
        fail(
          `${relative}: ${hits.length} × ${name} left by the migration (e.g. "${hits[0][0]}")`
        );
      }
    }
  }
}

function checkNoBreakSpaces(files) {
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const hits = [...source.matchAll(/\u00a0/g)];
    if (hits.length) {
      const line = source.slice(0, hits[0].index).split('\n').length;
      fail(
        `${path.relative(process.cwd(), file)}: ${hits.length} × no-break space (U+00A0) (e.g. line ${line})`
      );
    }
  }
}

// Every heading in a parsed page, with the languages of the {% iflang %} block
// around it; `langs` is undefined for a heading every language shows.
function headingsIn(node, langs, out = []) {
  if (node.type === 'heading') out.push({ node, langs });
  const inner =
    node.type === 'tag' && node.tag === 'iflang'
      ? node.attributes.langs.split(',').map((s) => s.trim())
      : langs;
  for (const child of node.children) headingsIn(child, inner, out);
  return out;
}

const textOf = (node) =>
  [...node.walk()]
    .filter((child) => child.type === 'text' || child.type === 'code')
    .map((child) => child.attributes.content)
    .join('');

/**
 * Headings are checked on the page as the site renders it, with every
 * overlay's sections inserted, since an overlay's headings nest under the
 * shared page's. A reader of each language meets a different sequence.
 */
function checkHeadings(version, pages, languages) {
  const readFile = snippetReader(CONTENT_ROOT, version);
  for (const page of pages) {
    const where = `${version}/${page.slug}`;
    const { shared, overlays } = readPageSources(page);
    let body;
    try {
      body = resolveDocument({ shared: shared ?? '', overlays, readFile });
    } catch (error) {
      fail(`${where}: cannot assemble: ${error.message}`);
      continue;
    }
    const tokenizer = new Markdoc.Tokenizer({ allowComments: true });
    const headings = headingsIn(Markdoc.parse(tokenizer.tokenize(body)));

    for (const { node } of headings) {
      if (node.attributes.level === 1)
        fail(
          `${where}: heading "${textOf(node)}" is an h1; the page title is the only h1`
        );
      // Bold text alone is a caption, not a section.
      const [inline] = node.children;
      const parts = inline.children.filter(
        (child) => child.type !== 'text' || child.attributes.content.trim()
      );
      if (parts.length === 1 && parts[0].type === 'strong')
        fail(`${where}: heading "${textOf(node)}" is bold text alone`);
    }

    const skips = new Map();
    for (const language of languages) {
      let previous = 1;
      for (const { node, langs } of headings) {
        if (langs && !langs.includes(language)) continue;
        const { level } = node.attributes;
        if (level > previous + 1) {
          const skip = `heading "${textOf(node)}" is an h${level} under an h${previous}`;
          skips.set(skip, [...(skips.get(skip) ?? []), language]);
        }
        previous = level;
      }
    }
    for (const [skip, affected] of skips) {
      const only =
        affected.length < languages.length ? ` (${affected.join(', ')})` : '';
      fail(`${where}: ${skip}${only}`);
    }
  }
}

for (const version of listVersions(CONTENT_ROOT)) {
  const nav = readNavigation(CONTENT_ROOT, version);

  const pages = listPages(CONTENT_ROOT, version);
  const { duplicates } = buildPageIndex(pages.map((page) => page.slug));
  const declared = new Set(navigationPages(nav.sidebar));
  const languages = nav.languages;

  console.log(`\n${version}: ${pages.length} pages`);

  // 1. every page is in the table of contents: listed under `pages:` by the
  //    page above it, up to the front page, index.md at the root, which lists
  //    the chapters.
  const orphans = pages.filter((page) => !declared.has(page.slug));
  for (const { slug } of orphans.slice(0, 20))
    fail(`${version}: ${slug} is not in the table of contents`);
  if (orphans.length > 20)
    fail(
      `${version}: ...and ${orphans.length - 20} more pages not in the table of contents`
    );

  // 2. page names are unique (cross-page links are keyed by them)
  for (const dup of duplicates)
    fail(`${version}: duplicate page name "${dup}"`);

  // 3. a file beside a page's index.md is the overlay for the language it is named after
  for (const page of pages) {
    for (const language of Object.keys(page.overlays)) {
      if (!languages.includes(language))
        fail(
          `${version}: ${path.relative(CONTENT_ROOT, page.overlays[language])} is an overlay for "${language}", which is not one of the manual's languages`
        );
    }
  }

  // 5, 6 & 9: defects inside the files themselves.
  const files = pages.flatMap((page) => [
    ...(page.shared ? [page.shared] : []),
    ...Object.values(page.overlays)
  ]);
  checkImages(version, files);
  checkStrayMarkup(files);
  checkNoBreakSpaces(files);

  // 7. every language slot is answered, and says what kind of answer it is.
  checkSlots(version, pages, languages);

  // 10. headings step down one level at a time from the title.
  checkHeadings(version, pages, languages);

  // 8. a page written per language is one page: its files agree on the title
  for (const page of pages) {
    if (page.shared) continue;
    const titles = new Set(
      Object.values(page.overlays).map(
        (file) => frontmatterOf(fs.readFileSync(file, 'utf8')).title
      )
    );
    if (titles.size > 1)
      fail(
        `${version}: "${page.name}" is titled ${[...titles].map((t) => `"${t}"`).join(', ')} — one title per page`
      );
  }
}

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}
console.log('\ncontent checks passed');
