// Copyright (c) ZeroC, Inc.
//
// Structural checks over the content tree. Run with `npm run check:content`.
//
// These are the invariants that make the docs hold together; each one, when
// violated, produces a page a reader cannot reach or a link that goes nowhere:
//
//   1. every page is in the table of contents: listed by the page above it, up to the front page
//   2. every overlay, and every language a page lists under `languages:`, is one of
//      the version's languages, and a page that lists its languages has no other overlay
//   3. every cross-page link resolves to a real page — checked by check:markdoc,
//      on each page as the site renders it
//   4. every image parses as an image, has alt text, and its file exists
//   5. none of the HTML tags and entities STRAY_MARKUP lists in a page's prose
//   6. every section an overlay defines is a slot its page declares, and an
//      overlay of a shared page has no text outside its sections
//   7. a page written per language has one title across its languages
//   8. no page holds a no-break space (U+00A0)
//   9. under the title, the page's h1, each heading is at most one level below
//      the one before it, in every language, and none is bold text alone
//  10. no code holds a curly double quote, and no prose a backtick
//
// Exit code 1 on a violation of any of them — those are defects in the files
// themselves, and the tree is clean of them today, so anything new is a
// regression. A version without a front page, a page that lists a page it does
// not contain, or one whose `languages:` is not a list, fails as the navigation
// is read.

import fs from 'node:fs';
import path from 'node:path';
import type { Node } from '@markdoc/markdoc';

import { parse } from '../markdoc/parse.ts';
import {
  declaredSlots,
  parseLanguageSections,
  resolveDocument,
  splitFrontmatter
} from '../lib/docs-model/resolve.ts';
import {
  CONTENT_ROOT,
  frontmatterOf,
  listPages,
  readNavigation,
  readPageSources,
  snippetReader,
  writtenFor,
  type PageFiles
} from '../lib/docs-model/content.ts';
import { ICE_VERSIONS } from '../app/ice/versions.ts';
import { navigationPages, type DocsVersion } from '../lib/docs-model/nav.ts';

const PUBLIC = path.join(process.cwd(), 'public');

let errors = 0;
const fail = (message: string) => {
  console.error(`error: ${message}`);
  errors++;
};

// Images. The capture is deliberately loose — it matches the *intent* to write
// an image, including forms CommonMark will not parse, because those are exactly
// the ones that reach the page as visible `![...](...)` gibberish.
const IMAGE_RE = /!\[([^\]]*)\]\(([^)]*)\)/g;

// The HTML a page must write in Markdown instead. Inline `<...>` in prose is
// usually a Slice or C++ generic (`sequence<int>`, `shared_ptr<T>`), so only
// these tags are listed, and only the entities Markdown has a spelling for.
const STRAY_MARKUP = [
  {
    name: 'raw HTML tag',
    re: /<\/?(?:div|table|tbody|thead|tr|td|th|p|span|br|hr|img)\b[^>]*>/gi
  },
  { name: 'HTML entity', re: /&(?:nbsp|amp|lt|gt|quot|#\d+);/g }
];

// Code samples are not prose: the IceGrid chapters are full of XML descriptors,
// and a `<node>` element inside a fence is the subject matter, not markup to
// flag. Blank the fences (keeping line count) before scanning.
function withoutCode(source: string) {
  return source
    .replace(/^```[\s\S]*?^```/gm, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (span) => span.replace(/[^\n]/g, ' '));
}

// Where an image target should resolve on disk: site-absolute paths come out of
// `public/`, relative ones out of the page's own directory.
function imageFileFor(target: string, sourceFile: string) {
  const clean = decodeURI(target.split(/[?#]/)[0]);
  return clean.startsWith('/')
    ? path.join(PUBLIC, clean)
    : path.join(path.dirname(sourceFile), clean);
}

function checkImages(version: string, files: string[]) {
  const missing = new Map<string, number>();
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

/**
 * Every section an overlay defines must be a slot its shared page declares, and
 * nothing may sit outside its sections: either renders nowhere. A slot an
 * overlay leaves out means that language adds nothing there.
 */
function checkSlots(version: string, pages: PageFiles[]) {
  for (const page of pages) {
    if (!page.shared) continue;
    const slots = declaredSlots(
      splitFrontmatter(fs.readFileSync(page.shared, 'utf8')).body
    );
    for (const [language, overlayPath] of Object.entries(page.overlays)) {
      const { body } = splitFrontmatter(fs.readFileSync(overlayPath, 'utf8'));
      let sections: Map<string, string>;
      try {
        sections = parseLanguageSections(body);
      } catch (error) {
        fail(
          `${version}/${language}: ${page.slug} overlay is malformed — ${(error as Error).message}`
        );
        continue;
      }
      for (const name of sections.keys())
        if (!slots.includes(name))
          fail(
            `${version}/${language}: ${page.slug} overlay defines unused section "${name}"`
          );
      const outside = body
        .replace(
          /\{% language-section name="[^"]*" %\}[\s\S]*?\{% \/language-section %\}/g,
          ''
        )
        .trim();
      if (outside)
        fail(
          `${version}/${language}: ${page.slug} overlay has text outside its sections, which renders nowhere: "${outside.split('\n')[0]}"`
        );
    }
  }
}

function checkStrayMarkup(files: string[]) {
  for (const file of files) {
    const source = withoutCode(fs.readFileSync(file, 'utf8'));
    const relative = path.relative(process.cwd(), file);
    for (const { name, re } of STRAY_MARKUP) {
      const hits = [...source.matchAll(re)];
      if (hits.length) {
        fail(`${relative}: ${hits.length} × ${name} (e.g. "${hits[0][0]}")`);
      }
    }
  }
}

function checkNoBreakSpaces(files: string[]) {
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

/**
 * Code must not hold a curly double quote, which no compiler takes in place of
 * `"`, and prose must not hold a backtick, which shows up literally where it
 * was meant to open a code span. Curly single quotes are left alone: a code
 * comment can use one as an apostrophe.
 */
function checkCodeCharacters(files: string[]) {
  const curly = /[\u201c\u201d]/;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const lines = source.split('\n');
    const relative = path.relative(process.cwd(), file);
    // An inline node carries its whole block's lines, so find the one that
    // holds its text, with backslash escapes resolved as the parser resolves
    // them.
    const lineOf = (node: Node, text: string) => {
      const [first, end] = node.lines;
      for (let i = first; i < end; i++)
        if (lines[i].replace(/\\([!-/:-@[-`{-~])/g, '$1').includes(text))
          return i + 1;
      return first + 1;
    };
    const visit = (node: Node) => {
      const content: unknown = node.attributes.content;
      if (node.type === 'fence') {
        // A fence's content starts on the line after its opening delimiter.
        const at = (content as string)
          .split('\n')
          .findIndex((line) => curly.test(line));
        if (at !== -1)
          fail(
            `${relative}:${node.lines[0] + 2 + at}: curly double quote in code`
          );
        return;
      }
      if (node.type === 'code') {
        if (curly.test(content as string))
          fail(
            `${relative}:${lineOf(node, content as string)}: curly double quote in code`
          );
        return;
      }
      // Text interpolating a variable holds the variable, not a string.
      if (
        node.type === 'text' &&
        typeof content === 'string' &&
        content.includes('`')
      )
        fail(
          `${relative}:${lineOf(node, content)}: backtick outside a code span`
        );
      for (const child of node.children) visit(child);
    };
    visit(parse(source));
  }
}

// Every heading in a parsed page, with the languages of the {% iflang %} block
// around it; `langs` is undefined for a heading every language shows.
function headingsIn(
  node: Node,
  langs?: string[],
  out: { node: Node; langs?: string[] }[] = []
) {
  if (node.type === 'heading') out.push({ node, langs });
  const inner =
    node.type === 'tag' && node.tag === 'iflang'
      ? (node.attributes.langs as string).split(',').map((s) => s.trim())
      : langs;
  for (const child of node.children) headingsIn(child, inner, out);
  return out;
}

const textOf = (node: Node) =>
  [...node.walk()]
    .filter((child) => child.type === 'text' || child.type === 'code')
    .map((child) => child.attributes.content as string)
    .join('');

/**
 * Headings are checked on the page as the site renders it, with every
 * overlay's sections inserted, since an overlay's headings nest under the
 * shared page's. A reader of each language meets a different sequence.
 */
function checkHeadings(
  version: DocsVersion,
  pages: PageFiles[],
  languages: string[]
) {
  const readFile = snippetReader(version);
  for (const page of pages) {
    const where = `${version.path}/${page.slug}`;
    const { shared, overlays, frontmatter } = readPageSources(page);
    let body: string;
    try {
      body = resolveDocument({ shared: shared ?? '', overlays, readFile });
    } catch (error) {
      fail(`${where}: cannot assemble: ${(error as Error).message}`);
      continue;
    }
    const headings = headingsIn(parse(body));

    for (const { node } of headings) {
      if (node.attributes.level === 1)
        fail(
          `${where}: heading "${textOf(node)}" is an h1; the page title is the only h1`
        );
      // Bold text alone is a caption, not a section.
      const [inline] = node.children;
      const parts = inline.children.filter(
        (child) =>
          child.type !== 'text' || (child.attributes.content as string).trim()
      );
      if (parts.length === 1 && parts[0].type === 'strong')
        fail(`${where}: heading "${textOf(node)}" is bold text alone`);
    }

    const pageLanguages = writtenFor(page, frontmatter) ?? languages;
    const skips = new Map<string, string[]>();
    for (const language of pageLanguages) {
      let previous = 1;
      for (const { node, langs } of headings) {
        if (langs && !langs.includes(language)) continue;
        const level = node.attributes.level as number;
        if (level > previous + 1) {
          const skip = `heading "${textOf(node)}" is an h${level} under an h${previous}`;
          skips.set(skip, [...(skips.get(skip) ?? []), language]);
        }
        previous = level;
      }
    }
    for (const [skip, affected] of skips) {
      const only =
        affected.length < pageLanguages.length
          ? ` (${affected.join(', ')})`
          : '';
      fail(`${where}: ${skip}${only}`);
    }
  }
}

for (const version of ICE_VERSIONS) {
  const nav = readNavigation(version);

  const pages = listPages(version);
  const declared = new Set(navigationPages(nav.sidebar));
  const { languages } = version;
  const where = version.path;

  console.log(`\n${where}: ${pages.length} pages`);

  // 1. every page is in the table of contents: listed under `pages:` by the
  //    page above it, up to the front page, index.md at the root, which lists
  //    the chapters.
  const orphans = pages.filter((page) => !declared.has(page.slug));
  for (const { slug } of orphans.slice(0, 20))
    fail(`${where}: ${slug} is not in the table of contents`);
  if (orphans.length > 20)
    fail(
      `${where}: ...and ${orphans.length - 20} more pages not in the table of contents`
    );

  // 2. a file beside a page's index.md is the overlay for the language it is named after,
  //    and a shared page that lists its languages lists the version's, and has
  //    overlays for those alone. A page written per language is written for
  //    its overlays' languages, so it lists none.
  for (const page of pages) {
    for (const language of Object.keys(page.overlays)) {
      if (!languages.includes(language))
        fail(
          `${where}: ${path.relative(CONTENT_ROOT, page.overlays[language])} is an overlay for "${language}", which is not one of the version's languages`
        );
      if (
        !page.shared &&
        'languages' in
          frontmatterOf(fs.readFileSync(page.overlays[language], 'utf8'))
      )
        fail(
          `${where}: ${path.relative(CONTENT_ROOT, page.overlays[language])} lists languages, but a page written per language is written for its overlays' languages`
        );
    }
    if (!page.shared) continue;
    const listed = writtenFor(
      page,
      frontmatterOf(fs.readFileSync(page.shared, 'utf8'))
    );
    if (listed === undefined) continue;
    const file = path.relative(CONTENT_ROOT, page.shared);
    for (const language of listed)
      if (!languages.includes(language))
        fail(
          `${where}: ${file} lists "${language}", which is not one of the version's languages`
        );
    for (const language of Object.keys(page.overlays))
      if (!listed.includes(language))
        fail(
          `${where}: ${file} is not written for "${language}", but has an overlay for it`
        );
  }

  // 4, 5, 8 & 10: defects inside the files themselves.
  const files = pages.flatMap((page) => [
    ...(page.shared ? [page.shared] : []),
    ...Object.values(page.overlays)
  ]);
  checkImages(where, files);
  checkStrayMarkup(files);
  checkNoBreakSpaces(files);
  checkCodeCharacters(files);

  // 6. every section an overlay defines is a slot its page declares, and
  //    nothing sits outside them.
  checkSlots(where, pages);

  // 9. headings step down one level at a time from the title.
  checkHeadings(version, pages, languages);

  // 7. a page written per language is one page: its files agree on the title
  for (const page of pages) {
    if (page.shared) continue;
    const titles = new Set(
      Object.values(page.overlays).map(
        (file) => frontmatterOf(fs.readFileSync(file, 'utf8')).title
      )
    );
    if (titles.size > 1)
      fail(
        `${where}: ${page.slug} is titled ${[...titles].map((t) => `"${t}"`).join(', ')} — one title per page`
      );
  }
}

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}
console.log('\ncontent checks passed');
