// Copyright (c) ZeroC, Inc.
//
// Validate every page of the docs against the site's Markdoc schema. Run with
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
// the route provides, so a page may refer to `$frontmatter` or `$path`. The
// transform also resolves every link and card against the page index, so the
// second pass reports one that names no page, which the site renders as plain
// text, one whose `#anchor` names no element on the page it links to, and one
// whose `?lang=` names a mapping the version lacks or one that doesn't show the
// anchor. It also reports two headings that a reader of one language sees under
// one anchor, and a URL of the Scroll Viewport site that redirects to a section
// its language doesn't show.
//
// Exit code 1 on any diagnostic at warning level or above, on a link to a page,
// an anchor, or a mapping that does not exist, on two headings with one anchor,
// and on a Scroll Viewport URL that lands on a section its language lacks.
// `child-invalid`, which a `{% callout %}` reflowed into its paragraph
// produces, is a warning.

import fs from 'node:fs';
import path from 'node:path';
import Markdoc, {
  type Config,
  type Node,
  type RenderableTreeNode,
  type Schema,
  type Tag
} from '@markdoc/markdoc';

import config from '../markdoc/config.ts';
import { parse } from '../markdoc/parse.ts';
import {
  CONTENT_ROOT,
  frontmatterOf,
  listPages,
  listVersions,
  readNavigation,
  readPageSources,
  readRedirects,
  snippetReader
} from '../lib/docs-model/content.ts';
import { buildPageIndex, type PageIndex } from '../lib/docs-model/links.ts';
import { pageHref } from '../lib/docs-model/nav.ts';
import { resolveDocument, splitLines } from '../lib/docs-model/resolve.ts';

// Consumed by lib/docs-model/resolve.ts before a page reaches Markdoc.
const resolverTags: Record<string, Schema> = {
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
const fails = (level: string) =>
  LEVELS.indexOf(level) >= LEVELS.indexOf('warning');

function validate(
  ast: Node,
  source: string,
  tags: Config['tags'],
  variables: Config['variables']
) {
  const lines = source.split('\n');
  return Markdoc.validate(ast, { ...config, tags, variables })
    .filter(({ error }) => fails(error.level))
    .map(({ error, lines: at }) => ({
      line: (at?.[0] ?? 0) + 1,
      text: `${error.level} ${error.id}: ${error.message}`,
      source: (lines[at?.[0] ?? 0] ?? '').trim()
    }));
}

const languagesByVersion: Record<string, string[]> = {};
for (const version of listVersions(CONTENT_ROOT)) {
  languagesByVersion[version] = readNavigation(CONTENT_ROOT, version).languages;
}

// The variables lib/markdown.ts gives a page, so `$frontmatter.title` or
// `$path` validate here as they render there. Validation only needs a variable
// to exist, so the reading time and the chrome are placeholders of the right
// shape; nothing in the docs refers to either.
const pageIndexes = new Map<string, PageIndex>();
function variablesFor({
  version,
  slug,
  frontmatter
}: {
  version: string;
  slug: string;
  frontmatter: Record<string, unknown>;
}) {
  if (!pageIndexes.has(version)) {
    pageIndexes.set(
      version,
      buildPageIndex(listPages(CONTENT_ROOT, version).map((page) => page.slug))
    );
  }
  return {
    ...config.variables,
    frontmatter,
    path: pageHref(version, slug),
    slug,
    readingTime: {},
    version,
    languages: languagesByVersion[version],
    pageIndex: pageIndexes.get(version),
    chrome: { breadcrumbs: [], pagination: [] }
  };
}

const diagnostics: { where: string; text: string }[] = [];
// What the first pass reported, so the second does not repeat it.
const reported = new Set<string>();

// 1. Every page as written.
let pages = 0;
const sourceTags = { ...config.tags, ...resolverTags };
for (const version of listVersions(CONTENT_ROOT)) {
  const files = listPages(CONTENT_ROOT, version).flatMap((page) =>
    [page.shared, ...Object.values(page.overlays)]
      .filter((file) => file !== undefined)
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

/** Every tag in a rendered tree, depth first. */
function* tagsOf(
  node: RenderableTreeNode | RenderableTreeNode[]
): Generator<Tag> {
  if (Array.isArray(node)) {
    for (const child of node) yield* tagsOf(child);
  } else if (Markdoc.Tag.isTag(node)) {
    yield node;
    yield* tagsOf(node.children);
  }
}

// 2. Every page as the site renders it.
let rendered = 0;
/** A heading as the outline lists it, with the mappings that show it, if not all. */
interface OutlineHeading {
  id: string;
  langs?: string[];
}

// Page URL -> the ids on the page, and its headings with the mappings that show
// them; and the links to check against them once every page is rendered.
const anchorsByPage = new Map<string, Set<string>>();
const headingsByPage = new Map<string, OutlineHeading[]>();
const checkedLinks: {
  where: string;
  url: string;
  href: string;
  languages: string[];
}[] = [];
const allPages = listVersions(CONTENT_ROOT).flatMap((version) =>
  listPages(CONTENT_ROOT, version).map((page) => ({ version, page }))
);
for (const { version, page } of allPages) {
  rendered++;
  const { slug } = page;
  const { shared, overlays, frontmatter } = readPageSources(page);
  const where = `${version}/${slug} (assembled)`;
  let body: string;
  try {
    // The same step as the page route.
    body = resolveDocument({
      shared: shared ?? '',
      overlays,
      readFile: snippetReader(CONTENT_ROOT, version)
    });
  } catch (error) {
    diagnostics.push({
      where,
      text: `cannot assemble: ${(error as Error).message}`
    });
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
  let tree: RenderableTreeNode;
  try {
    tree = Markdoc.transform(ast, { ...config, variables });
  } catch (error) {
    diagnostics.push({
      where,
      text: `transform failed: ${(error as Error).message}`
    });
    continue;
  }
  const url = pageHref(version, slug);
  const anchors = new Set<string>();
  for (const tag of tagsOf(tree)) {
    const { id, href, unresolved } = tag.attributes as {
      id?: unknown;
      href?: string;
      unresolved?: boolean;
    };
    if (typeof id === 'string') anchors.add(id);
    if (unresolved)
      diagnostics.push({
        where,
        text: `link to a page that does not exist: ${href}`
      });
    else if (typeof href === 'string' && /[#?]/.test(href))
      checkedLinks.push({ where, url, href, languages: variables.languages });
  }
  const { headings } = (tree as Tag).attributes as {
    headings: OutlineHeading[];
  };
  anchorsByPage.set(url, anchors);
  headingsByPage.set(url, headings);

  // A link or the outline reaches only the first of two headings with one
  // anchor. MD024 sees a file at a time; this sees a shared page's headings
  // with each language's overlay headings among them, as the outline lists them.
  const repeats = new Map<string, Set<string>>();
  for (const language of variables.languages) {
    const ids = headings
      .filter(({ langs }) => !langs || langs.includes(language))
      .map(({ id }) => id);
    for (const id of ids.filter((id, i) => ids.indexOf(id) !== i))
      repeats.set(id, new Set([...(repeats.get(id) ?? []), language]));
  }
  for (const [id, languages] of repeats) {
    const only =
      languages.size < variables.languages.length
        ? ` (${[...languages].join(', ')})`
        : '';
    diagnostics.push({
      where,
      text: `two headings share the anchor #${id}${only}`
    });
  }
}

// Only links to the site's own pages are checked here; lychee checks the
// anchors of external pages. A `?lang=` must name one of the version's mappings,
// and that mapping must show the anchor.
for (const { where, url, href, languages } of checkedLinks) {
  const hashAt = href.indexOf('#');
  const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt);
  const [page, query] = beforeHash.split('?');
  const target = page || url;
  const anchors = anchorsByPage.get(target);
  if (!anchors) continue;
  const language = new URLSearchParams(query).get('lang');
  if (language !== null && !languages.includes(language)) {
    diagnostics.push({
      where,
      text: `link to a mapping the version lacks: ${href}`
    });
    continue;
  }
  if (hashAt === -1) continue;
  const anchor = decodeURIComponent(href.slice(hashAt + 1));
  if (!anchors.has(anchor)) {
    diagnostics.push({ where, text: `link to a missing anchor: ${href}` });
    continue;
  }
  if (language === null) continue;
  const shown = ({ id, langs }: OutlineHeading) =>
    id === anchor && (!langs || langs.includes(language));
  if (!headingsByPage.get(target)!.some(shown))
    diagnostics.push({
      where,
      text: `link to an anchor the ${language} mapping doesn't show: ${href}`
    });
}

// The URLs a version had on the Scroll Viewport site redirect to its pages (see
// readRedirects); one that lands on a section must land on a heading the URL's
// language shows. Scroll Viewport URL -> that page, section, and language:
const scrollSections = new Map<
  string,
  { page: string; anchor: string; language: string }
>();
for (const { source, destination } of readRedirects(CONTENT_ROOT)) {
  const [, version, languages, rest] =
    source.match(/^\/ice\/([^/]+)\/:lang\(([^)]*)\)(.*)$/) ?? [];
  const [beforeHash, anchor] = destination.split('#');
  if (!languages || anchor === undefined) continue;
  const page = beforeHash.split('?')[0];
  for (const language of languages.split('|'))
    scrollSections.set(`/ice/${version}/${language}${rest}`, {
      page,
      anchor: decodeURIComponent(anchor),
      language
    });
}
for (const version of listVersions(CONTENT_ROOT)) {
  const file = path.join(CONTENT_ROOT, version, 'scroll-urls.txt');
  if (!fs.existsSync(file)) continue;
  for (const scrollUrl of splitLines(fs.readFileSync(file, 'utf8'))) {
    // The Scroll Viewport site spelled `js` as `javascript`.
    const section = scrollSections.get(
      scrollUrl.replace(`/ice/${version}/javascript/`, `/ice/${version}/js/`)
    );
    if (!section) continue;
    const { page, anchor, language } = section;
    // A page that failed to render is reported above.
    const headings = headingsByPage.get(page);
    if (!headings) continue;
    const shown = ({ id, langs }: OutlineHeading) =>
      id === anchor && (!langs || langs.includes(language));
    if (!headings.some(shown))
      diagnostics.push({
        where: `${version}/redirects.yaml`,
        text: `${scrollUrl} lands on #${anchor}, which the ${language} mapping of ${page} doesn't show`
      });
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
