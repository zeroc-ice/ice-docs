// Copyright (c) ZeroC, Inc.
//
// Validate every page of the manual against the site's Markdoc schema. Run with
// `npm run check:markdoc`; `npm run build` runs it first.
//
// The build never validates. `Markdoc.transform` renders whatever the parser
// produced, and the parser is forgiving: a block tag that lands inside a
// paragraph, a closing tag with no opening one, or an attribute value the
// schema does not accept all render as something — usually the wrong thing —
// without a word from the build. This is the check the Markdoc language server
// runs in the editor, applied to the whole tree, so CI sees what the editor
// would have shown.
//
// Two passes. The first validates each page as written, one file at a time, so
// a diagnostic names the file and line to fix; the two tags the resolver
// consumes before Markdoc sees a page — `language-section` and `snippet` — are
// declared for it with their attributes. The second takes each page as the
// site renders it: a shared page with every language overlay's sections
// inserted and its snippets expanded, which is the only place a problem of
// insertion can show, such as an overlay heading that lands inside a callout.
// It validates that, then runs `Markdoc.transform` on it the way the route
// does, since a tag's transform can fail where validation passed. That pass can
// only point at a line of the assembled page, so it quotes the line, and it
// skips anything the first pass already reported. Both passes see the variables
// the route provides, so a page may refer to `$frontmatter` or `$path`.
//
// Exit code 1 on any diagnostic at warning level or above. `child-invalid`,
// which a `{% callout %}` reflowed into its paragraph produces, is a warning.

import fs from 'node:fs';
import path from 'node:path';
import Markdoc from '@markdoc/markdoc';

import config from '../markdoc/config.ts';
import {
  CONTENT_ROOT,
  frontmatterOf,
  listPages,
  listVersions,
  readNavigation,
  readPageSources,
  snippetReader
} from '../lib/docs-model/content.ts';
import { buildPageIndex } from '../lib/docs-model/links.ts';
import { pageHref } from '../lib/docs-model/nav.ts';
import {
  demoteHeadings,
  resolveDocument,
  stripRedundantTitle
} from '../lib/docs-model/resolve.ts';

// Consumed by lib/docs-model/resolve.ts before a page reaches Markdoc.
const resolverTags = {
  'language-section': {
    attributes: {
      name: { type: String, required: true },
      state: { type: String, matches: ['no-addition', 'not-applicable'] },
      note: { type: String }
    }
  },
  snippet: {
    selfClosing: true,
    attributes: {
      file: { type: String, required: true },
      name: { type: String, required: true },
      lang: { type: String }
    }
  }
};

const LEVELS = ['debug', 'info', 'warning', 'error', 'critical'];
const fails = (level) => LEVELS.indexOf(level) >= LEVELS.indexOf('warning');

/** Parse one document with the same tokenizer settings as lib/markdown.ts. */
function parse(source) {
  const tokenizer = new Markdoc.Tokenizer({ allowComments: true });
  return Markdoc.parse(tokenizer.tokenize(source));
}

function validate(ast, source, tags, variables) {
  const lines = source.split('\n');
  return Markdoc.validate(ast, { ...config, tags, variables })
    .filter(({ error }) => fails(error.level))
    .map(({ error, lines: at }) => ({
      line: (at?.[0] ?? 0) + 1,
      text: `${error.level} ${error.id}: ${error.message}`,
      source: (lines[at?.[0] ?? 0] ?? '').trim()
    }));
}

const languagesByVersion = {};
for (const version of listVersions(CONTENT_ROOT)) {
  languagesByVersion[version] = readNavigation(CONTENT_ROOT, version).languages;
}

// The variables lib/markdown.ts gives a page, so `$frontmatter.title` or
// `$path` validate here as they render there. Validation only needs a variable
// to exist, so the reading time and the chrome are placeholders of the right
// shape; nothing in the manual refers to either.
const pageIndexes = new Map();
function variablesFor({ version, slug, frontmatter }) {
  if (!pageIndexes.has(version)) {
    const { index } = buildPageIndex(
      listPages(CONTENT_ROOT, version).map((page) => page.slug)
    );
    pageIndexes.set(version, index);
  }
  return {
    ...config.variables,
    frontmatter,
    path: pageHref(version, slug),
    readingTime: {},
    version,
    languages: languagesByVersion[version],
    pageIndex: pageIndexes.get(version),
    chrome: { breadcrumbs: [], pagination: [] }
  };
}

const diagnostics = [];
// What the first pass reported, so the second does not repeat it.
const reported = new Set();

// 1. Every page as written.
let pages = 0;
const sourceTags = { ...config.tags, ...resolverTags };
for (const version of listVersions(CONTENT_ROOT)) {
  const files = listPages(CONTENT_ROOT, version).flatMap((page) =>
    [page.shared, ...Object.values(page.overlays)]
      .filter(Boolean)
      .map((file) => ({ file, slug: page.slug }))
  );
  for (const { file, slug } of files.sort((a, b) =>
    a.file.localeCompare(b.file)
  )) {
    pages++;
    const source = fs.readFileSync(file, 'utf8');
    const variables = variablesFor({
      version,
      slug,
      frontmatter: frontmatterOf(source)
    });
    for (const d of validate(parse(source), source, sourceTags, variables)) {
      diagnostics.push({
        where: `${path.relative(process.cwd(), file)}:${d.line}`,
        text: d.text
      });
      reported.add(`${d.text}\n${d.source}`);
    }
  }
}

// 2. Every page as the site renders it.
let rendered = 0;
const allPages = listVersions(CONTENT_ROOT).flatMap((version) =>
  listPages(CONTENT_ROOT, version).map((page) => ({ version, page }))
);
for (const { version, page } of allPages) {
  rendered++;
  const { slug } = page;
  const { shared, overlays, frontmatter } = readPageSources(page);
  const where = `${version}/${slug} (assembled)`;
  let body;
  try {
    // The same steps, in the same order, as the page route.
    body = demoteHeadings(
      stripRedundantTitle(
        resolveDocument({
          shared: shared ?? '',
          overlays,
          readFile: snippetReader(CONTENT_ROOT, version)
        }),
        frontmatter.title
      )
    );
  } catch (error) {
    diagnostics.push({ where, text: `cannot assemble: ${error.message}` });
    continue;
  }
  const variables = variablesFor({ version, slug, frontmatter });
  const ast = parse(body);
  for (const d of validate(ast, body, config.tags, variables)) {
    if (reported.has(`${d.text}\n${d.source}`)) continue;
    diagnostics.push({
      where: `${where}:${d.line}`,
      text: `${d.text}\n    ${d.source}`
    });
  }
  // What the route does next: a tag's transform can throw where validation
  // passed.
  try {
    Markdoc.transform(ast, { ...config, variables });
  } catch (error) {
    diagnostics.push({ where, text: `transform failed: ${error.message}` });
  }
}

for (const d of diagnostics) console.error(`${d.where}: ${d.text}`);

if (diagnostics.length) {
  console.error(
    `\n${diagnostics.length} diagnostic(s) across ${pages} pages and ${rendered} rendered pages`
  );
  process.exit(1);
}
console.log(
  `${pages} pages and ${rendered} rendered pages validate and transform against the Markdoc schema`
);
