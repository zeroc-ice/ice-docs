// Copyright (c) ZeroC, Inc.
//
// Every page as Markdown, for agents and crawlers, which read a page far more
// easily as Markdown than as HTML with every language mapping in it. The copy
// is served at the page's URL with `.md` appended, which markdownRewrite in
// lib/docs-model/nav.ts sends to the route under `app/md/`, a thin wrapper per
// version that names its version and hands the rest to these.
//
// Every page's `<page>.md` is the whole page, for every language mapping it is
// written for, and a page written for one mapping is that mapping's text. A
// page whose text differs by mapping, by an `{% iflang %}` block or an `api:`
// link, also has one document per mapping, at `<page>/<language>.md`, each the
// page as a reader of that mapping sees it. Links between pages point at the
// Markdown copies, at the copy for the same mapping where the page has one.

import type { RenderableTreeNode } from '@markdoc/markdoc';

import {
  listPages,
  readApiLinks,
  readNavigation,
  readPageSources,
  snippetReader,
  writtenFor,
  type PageFiles
} from '@/lib/docs-model/content';
import {
  buildPageIndex,
  type ApiLinks,
  type PageIndex
} from '@/lib/docs-model/links';
import {
  languageLabel,
  markdownHref,
  markdownLink,
  navigationPages,
  pageHref,
  SITE_TITLE,
  type DocsVersion
} from '@/lib/docs-model/nav';
import { resolveDocument } from '@/lib/docs-model/resolve';
import { renderMarkdownString } from '@/lib/markdown';
import {
  escapeText,
  hasLanguageBlocks,
  list,
  renderMarkdown
} from '@/lib/plain-markdown';
import { SITE_URL } from '@/lib/site';

/** A page as the site transforms it, and the mappings its copies are for. */
interface Assembled {
  slug: string;
  title: string;
  description?: string;
  tree: RenderableTreeNode;
  /** The mappings the page is written for. */
  languages: string[];
  /** The one mapping the page is written for, if it is written for one. */
  mapping?: string;
  /** Whether its text differs by mapping. */
  varies: boolean;
}

const absolute = (href: string) => new URL(href, SITE_URL).href;

const INDEX = '/llms.txt';

function assemble(
  version: DocsVersion,
  page: PageFiles,
  pageIndex: PageIndex,
  apiLinks: ApiLinks
): Assembled {
  const { shared, overlays, frontmatter } = readPageSources(page);
  const tree = renderMarkdownString({
    source: resolveDocument({
      shared: shared ?? '',
      overlays,
      readFile: snippetReader(version)
    }),
    path: pageHref(version, page.slug),
    slug: page.slug,
    version,
    pageIndex,
    apiLinks,
    frontmatter
  });
  const languages = writtenFor(page, frontmatter) ?? version.languages;
  const mapping = languages.length === 1 ? languages[0] : undefined;
  return {
    slug: page.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    tree,
    languages,
    mapping,
    varies: !mapping && hasLanguageBlocks(tree)
  };
}

const assembledCache = new Map<string, Map<string, Assembled>>();

/**
 * Every page of the version, assembled, by slug.
 *
 * Cached per version in production, as listPages is: a build renders every
 * copy of every page, and each copy's links need to know which pages have a
 * copy per mapping. Never cached in development, where pages change while the
 * server is running.
 */
function assembleAll(version: DocsVersion): Map<string, Assembled> {
  const cacheable = process.env.NODE_ENV === 'production';
  let pages = cacheable ? assembledCache.get(version.path) : undefined;
  if (!pages) {
    const all = listPages(version);
    const pageIndex = buildPageIndex(all.map((page) => page.slug));
    const apiLinks = readApiLinks(version);
    pages = new Map(
      all.map((page) => [
        page.slug,
        assemble(version, page, pageIndex, apiLinks)
      ])
    );
    if (cacheable) assembledCache.set(version.path, pages);
  }
  return pages;
}

/**
 * A page's Markdown: with `language`, its text for that mapping; otherwise its
 * text for every mapping it is written for.
 */
function markdownText(
  version: DocsVersion,
  pages: Map<string, Assembled>,
  { slug, title, description, tree, languages, mapping, varies }: Assembled,
  language?: string
): string {
  // The mapping the text is for: the copy's, or the page's one mapping.
  const textLanguage = language ?? mapping;
  const copy = (copyLanguage: string) =>
    `[${languageLabel(copyLanguage)}](${absolute(markdownHref(version, slug, copyLanguage))})`;
  // What nextjs.org's own copies open with: the page's facts as frontmatter,
  // then a pointer to the index.
  const frontmatter = [
    `title: ${JSON.stringify(title)}`,
    description && `description: ${JSON.stringify(description)}`,
    `url: ${absolute(pageHref(version, slug))}`,
    textLanguage && `language: ${textLanguage}`,
    `docs_index: ${absolute(INDEX)}`
  ]
    .filter(Boolean)
    .join('\n');
  const head =
    `---\n${frontmatter}\n---\n\n` +
    `> For an index of every page, see [llms.txt](${absolute(INDEX)}).\n\n` +
    `# ${escapeText(title)}\n\n${description ? `${escapeText(description)}\n\n` : ''}`;

  // What the page shell tells the reader: the mappings the page is written
  // for, and where each mapping's text alone is; or which mapping's text this
  // is and where the others' are.
  let notice = '';
  if (language === undefined) {
    if (languages.length < version.languages.length)
      notice += `This page is written for ${list(languages.map(languageLabel))}.\n\n`;
    if (varies)
      notice += `Parts of this page are for some programming languages only, and name them. For one language's text alone, see ${list(languages.map(copy))}.\n\n`;
  } else {
    const others = languages.filter((other) => other !== language).map(copy);
    notice = `Programming language: ${languageLabel(language)}.${others.length ? ` Other languages: ${others.join(', ')}.` : ''}\n\n`;
  }

  const body = renderMarkdown(tree, {
    language: textLanguage,
    href: (href) => {
      const link = markdownLink(version, href, {
        slug,
        language: textLanguage,
        copies: (target) => {
          const page = pages.get(target);
          return page?.varies ? page.languages : undefined;
        }
      });
      return link.startsWith('/') ? absolute(link) : link;
    }
  });
  return head + notice + body;
}

/** The route's params: every page, and, for a page whose text differs by mapping, each of its mappings. */
export function pageMarkdownParams(version: DocsVersion) {
  return [...assembleAll(version).values()].flatMap(
    ({ slug, languages, varies }) => {
      // The front page's slug is empty: its copy is at the version root.
      const segments = slug ? slug.split('/') : [];
      return [
        { slug: segments },
        ...(varies
          ? languages.map((language) => ({ slug: [...segments, language] }))
          : [])
      ];
    }
  );
}

/** The Markdown the route's params name, as the response to serve. */
export async function pageMarkdown(
  version: DocsVersion,
  props: { params: Promise<{ slug?: string[] }> }
): Promise<Response> {
  const segments = (await props.params).slug ?? [];
  const pages = assembleAll(version);
  // The params name a page, or a page and one of its mappings.
  const own = pages.get(segments.join('/'));
  const page = own ?? pages.get(segments.slice(0, -1).join('/'))!;
  const language = own ? undefined : segments.at(-1);
  // The HTML page is the canonical form of every copy, as its head says in turn
  // with its `rel="alternate"` link to the copy.
  return new Response(markdownText(version, pages, page, language), {
    headers: {
      ...MARKDOWN_HEADERS,
      Link: `<${absolute(pageHref(version, page.slug))}>; rel="canonical"`
    }
  });
}

/** The headers of a Markdown response: readable by a page on another origin, as a tool in a browser is. */
export const MARKDOWN_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

/** The index at `/llms.txt`: how the Markdown copies are laid out, and every page of every version, by chapter. */
export function llmsTxt(versions: DocsVersion[]): string {
  const latest = versions.find((v) => v.status === 'latest') ?? versions[0];
  const summary = assembleAll(latest).get('')!.description;

  const sections = versions.flatMap((version) => {
    const pages = assembleAll(version);
    const entry = (slug: string) => {
      const { title, description } = pages.get(slug)!;
      const note = description ? `: ${escapeText(description)}` : '';
      return `- [${escapeText(title)}](${absolute(markdownHref(version, slug))})${note}`;
    };
    const [front, ...chapters] = readNavigation(version).sidebar;
    return [
      `## ${version.title}\n\n${entry(front.slug!)}`,
      ...chapters.map(
        (chapter) =>
          `## ${chapter.title} (${version.title})\n\n${navigationPages([chapter]).map(entry).join('\n')}`
      )
    ];
  });

  return `${[
    `# ${SITE_TITLE}`,
    `> ${summary}`,
    'Every page is available as Markdown at its URL with `.md` appended. A page whose text differs by programming ' +
      'language names the languages of each part that is not for all of them, and also has one Markdown file per ' +
      "language, at `<page>/<language>.md`, with that language's text alone. Context7 " +
      'indexes these docs as `/zeroc-ice/ice-docs`.',
    ...sections
  ].join('\n\n')}\n`;
}
