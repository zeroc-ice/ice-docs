// Copyright (c) ZeroC, Inc.
//
// Structural checks over the content tree. Run with `npm run check:content`.
//
// These are the invariants that make the manual hold together; each one, when
// violated, produces a page a reader cannot reach or a link that goes nowhere:
//
//   1. every page file is reachable from navigation.yaml
//   2. every navigation entry points at a page that exists
//   3. no two pages share a slug (cross-page links are keyed by it)
//   4. every cross-page link resolves to a real page
//   5. every image parses as an image, has alt text, and its file exists
//   6. no raw HTML or Confluence markup survived the migration
//   7. every language slot is answered, and says which kind of answer it is
//
// Exit code 1 on a violation of 1-3, 5a/5b (unparseable image markup and missing
// alt text) and 6 — those are defects in the files themselves, and the tree is
// clean of them today, so anything new is a regression.
//
// Unresolved links (4) and missing image files (5c) are reported and fail only
// under --strict: the migrated manual still links to pages that were never
// brought over, and none of its Confluence attachments were migrated at all.

import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

import { buildPageIndex, resolveDocLink } from '../lib/docs-model/links.ts';
import {
  declaredSlots,
  parseLanguageSections,
  splitFrontmatter
} from '../lib/docs-model/resolve.ts';
import { listVersions, listPageEntries, readNavigationYaml } from '../lib/docs-model/content.ts';
import { navigationSlugs } from '../lib/docs-model/nav.ts';

const strict = process.argv.includes('--strict');
const ROOT = path.join(process.cwd(), 'content');
const PUBLIC = path.join(process.cwd(), 'public');

let errors = 0;
const fail = (message) => {
  console.error(`error: ${message}`);
  errors++;
};

// Markdown links `[text](target)` and card hrefs `{% card ... href="target" %}`.
// Both go through the same build-time resolver, so both are checked.
// Reference-style links and bare URLs are not used by the migrated content.
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const CARD_HREF_RE = /\{%\s*card[^%]*?href="([^"]+)"/g;

// Images. The capture is deliberately loose — it matches the *intent* to write
// an image, including forms CommonMark will not parse, because those are exactly
// the ones that reach the page as visible `![...](...)` gibberish.
const IMAGE_RE = /!\[([^\]]*)\]\(([^)]*)\)/g;

// Block-level HTML and Confluence storage-format leftovers. Inline `<...>` in
// prose is usually a Slice or C++ generic (`sequence<int>`, `shared_ptr<T>`),
// so only tags that a converter emits are listed.
const STRAY_MARKUP = [
  { name: 'raw HTML block tag', re: /<\/?(?:div|table|tbody|thead|tr|td|th|p|span|br|hr|img)\b[^>]*>/gi },
  { name: 'Confluence storage markup', re: /<\/?(?:ac|ri):[a-z-]+/gi },
  { name: 'Confluence wiki macro', re: /\{(?:code|panel|noformat|info|note|warning|tip)(?::[^}]*)?\}/g },
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

/** Every .md file under a version, as absolute paths. */
function markdownFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    const abs = path.join(dir, entry);
    if (fs.statSync(abs).isDirectory()) markdownFiles(abs, out);
    else if (entry.endsWith('.md')) out.push(abs);
  }
  return out;
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
        fail(`${relative}: image target contains whitespace, so it renders as text: "${target}"`);
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
      if (/^(?:https?:)?\/\//.test(target) || target.startsWith('data:')) continue;

      if (!fs.existsSync(imageFileFor(target, file))) {
        missing.set(target, (missing.get(target) ?? 0) + 1);
      }
    }
  }

  const missingCount = [...missing.values()].reduce((a, b) => a + b, 0);
  console.log(`${version}: ${total} images, ${missingCount} missing (${missing.size} distinct)`);
  if (missingCount) {
    for (const [target, count] of [...missing.entries()].slice(0, 10)) {
      console.log(`  ${String(count).padStart(4)}  ${target}`);
    }
    if (missing.size > 10) console.log(`  ...and ${missing.size - 10} more`);
    if (strict) fail(`${version}: ${missingCount} images point at files that do not exist`);
  }
}

// The number of blank language sections that had no explanation when the slot
// states were introduced. It is a ratchet: classifying slots lowers it, and the
// check fails if it ever rises. When it reaches 0, delete this and make
// `onUnclassified: 'error'` the resolver's default.
const UNCLASSIFIED_SLOT_BASELINE = 462;

/**
 * Every slot a shared page declares must be answered by each language overlay,
 * and the answer must say which kind of answer it is: prose, "this mapping adds
 * nothing", or "this mapping cannot do this, because…". A blank section says
 * none of those, and the reader cannot tell the three apart.
 */
function checkSlots(version, languages) {
  const shared = path.join(ROOT, version, 'shared');
  const langRoot = path.join(ROOT, version, 'languages');
  const counts = { content: 0, 'no-addition': 0, 'not-applicable': 0, unclassified: 0 };
  const perLanguage = Object.fromEntries(languages.map((l) => [l, 0]));
  // slug -> language -> slot names still blank, for the `--slots` worklist.
  const blanks = new Map();
  let missing = 0;
  let unused = 0;

  for (const file of markdownFiles(shared)) {
    const slug = path.relative(shared, file).replace(/\.md$/, '');
    const slots = declaredSlots(splitFrontmatter(fs.readFileSync(file, 'utf8')).body);
    if (slots.length === 0) continue;

    for (const language of languages) {
      const overlayPath = path.join(langRoot, language, `${slug}.md`);
      if (!fs.existsSync(overlayPath)) {
        // The shared page asks for language-specific prose and none exists.
        missing += slots.length;
        fail(`${version}/${language}: "${slug}" declares ${slots.length} slot(s) but has no overlay`);
        continue;
      }

      let sections;
      try {
        sections = parseLanguageSections(splitFrontmatter(fs.readFileSync(overlayPath, 'utf8')).body);
      } catch (error) {
        fail(`${version}/${language}: "${slug}" overlay is malformed — ${error.message}`);
        continue;
      }

      for (const name of slots) {
        const slot = sections.get(name);
        if (!slot) {
          missing++;
          fail(`${version}/${language}: "${slug}" has no section for slot "${name}"`);
          continue;
        }
        counts[slot.state]++;
        if (slot.state === 'unclassified') {
          perLanguage[language]++;
          if (!blanks.has(slug)) blanks.set(slug, new Map());
          const byLanguage = blanks.get(slug);
          byLanguage.set(language, [...(byLanguage.get(language) ?? []), name]);
        }
      }
      // A section nobody asked for is dead content: it renders nowhere.
      for (const name of sections.keys()) {
        if (!slots.includes(name)) {
          unused++;
          fail(`${version}/${language}: "${slug}" overlay defines unused section "${name}"`);
        }
      }
    }
  }

  // `--slots` prints the classification worklist, grouped so a reviewer can take
  // one page and answer it for every language at once.
  if (process.argv.includes('--slots') && blanks.size) {
    console.log('\nunclassified slots by page:');
    for (const [slug, byLanguage] of [...blanks.entries()].sort()) {
      console.log(`  ${slug}`);
      for (const [language, names] of [...byLanguage.entries()].sort()) {
        console.log(`    ${language.padEnd(7)} ${names.join(', ')}`);
      }
    }
    console.log('');
  }

  const classified = counts.content + counts['no-addition'] + counts['not-applicable'];
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
      '  unclassified by language: ' + worst.map(([l, n]) => `${l} ${n}`).join(', ')
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
        `lower UNCLASSIFIED_SLOT_BASELINE in scripts/check-content.mjs to ${counts.unclassified}`
    );
  }
  if (strict && counts.unclassified) {
    fail(`${version}: ${counts.unclassified} language slots do not say why they are blank`);
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
        fail(`${relative}: ${hits.length} × ${name} left by the migration (e.g. "${hits[0][0]}")`);
      }
    }
  }
}

for (const version of listVersions(ROOT)) {
  const nav = yamlLoad(readNavigationYaml(ROOT, version) ?? '');
  if (!nav) {
    fail(`${version}: no navigation.yaml`);
    continue;
  }

  const entries = listPageEntries(ROOT, version);
  const slugs = entries.map((e) => e.path);
  const { duplicates } = buildPageIndex(entries);
  const declared = new Set(navigationSlugs(nav));

  console.log(`\n${version}: ${slugs.length} pages`);

  // 1. every page is reachable from the navigation
  const orphans = slugs.filter((slug) => !declared.has(slug));
  for (const slug of orphans.slice(0, 20)) fail(`${version}: "${slug}" is not in navigation.yaml`);
  if (orphans.length > 20) fail(`${version}: ...and ${orphans.length - 20} more unreachable pages`);

  // 2. every navigation entry exists
  const known = new Set(slugs);
  const dangling = [...declared].filter((slug) => !known.has(slug));
  for (const slug of dangling.slice(0, 20)) fail(`${version}: navigation points at missing page "${slug}"`);
  if (dangling.length > 20) fail(`${version}: ...and ${dangling.length - 20} more missing pages`);

  // 3. slugs are unique (cross-page links are keyed by them)
  for (const dup of duplicates) fail(`${version}: duplicate page name "${dup}"`);

  // 4. cross-page links resolve — checked once per language, because a page that
  //    exists only in C++ must not resolve while rendering the Python manual.
  const unresolved = new Map();
  const languages = nav.languages?.length ? nav.languages : ['cpp'];
  const files = [
    ...markdownFiles(path.join(ROOT, version, 'shared')),
    ...markdownFiles(path.join(ROOT, version, 'languages'))
  ];

  // 5 & 6: defects inside the files themselves, independent of language.
  checkImages(version, files);
  checkStrayMarkup(files);

  // 7. every language slot is answered, and says what kind of answer it is.
  checkSlots(version, languages);

  let total = 0;
  for (const language of languages) {
    const { index: languageIndex } = buildPageIndex(listPageEntries(ROOT, version, language));
    for (const file of files) {
      // An overlay is only ever rendered for its own language. `files` holds
      // platform-native paths, so match either separator — on Windows a
      // forward-slash-only pattern never matches, and every overlay would be
      // checked against all nine languages.
      const overlay = /[\\/]languages[\\/]([^\\/]+)[\\/]/.exec(file);
      if (overlay && overlay[1] !== language) continue;

      const source = fs.readFileSync(file, 'utf8');
      const targets = [...source.matchAll(LINK_RE), ...source.matchAll(CARD_HREF_RE)];
      for (const match of targets) {
        total++;
        if (resolveDocLink(match[1], { version, language, index: languageIndex }).resolved) continue;
        const key = `${match[1]} (${language})`;
        unresolved.set(key, (unresolved.get(key) ?? 0) + 1);
      }
    }
  }

  const unresolvedCount = [...unresolved.values()].reduce((a, b) => a + b, 0);
  console.log(`${version}: ${total} links, ${unresolvedCount} unresolved (${unresolved.size} distinct)`);
  if (unresolvedCount) {
    const worst = [...unresolved.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
    for (const [target, count] of worst) console.log(`  ${String(count).padStart(4)}  ${target}`);
    if (strict) fail(`${version}: ${unresolvedCount} unresolved cross-page links`);
  }
}

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}
console.log('\ncontent checks passed');
