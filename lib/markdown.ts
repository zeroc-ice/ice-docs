// Copyright (c) ZeroC, Inc.

import Markdoc, { Config } from '@markdoc/markdoc';
import { parse } from '@/markdoc/parse';
import config from '@/markdoc/schema';
import readingTimeFunc from 'reading-time';
import { projectLanguage } from './project-language.ts';

import type { ApiLinks, PageIndex } from '@/lib/docs-model/links';

/** What a page's Markdoc schema finds in `config.variables`. */
export interface PageVariables {
  /** The page's frontmatter. */
  frontmatter: Record<string, unknown>;
  /** The route this page is rendered at, e.g. `/ice/3.8/slice/enumerations`. */
  path: string;
  /** The page's slug under the version, `slice/enumerations`; `''` for the front page. */
  slug: string;
  /** By language mapping. */
  readingTime: Record<string, string>;
  version: string;
  /**
   * The languages the text is for, for what is computed once per language:
   * the version's, or inside an `{% iflang %}`, its own.
   */
  languages: string[];
  /** Page index used to resolve cross-page links at build time. */
  pageIndex: PageIndex;
  /** API reference pages used to resolve `api:` links at build time. */
  apiLinks: ApiLinks;
  /** Navigation-derived page chrome: breadcrumbs, prev/next, body shape. */
  chrome: Record<string, unknown>;
}

export interface RenderOptions extends Omit<
  PageVariables,
  'readingTime' | 'chrome'
> {
  /** The assembled page source (shared prose + every language overlay + snippets). */
  source: string;
  chrome?: PageVariables['chrome'];
}

// Transform an already-assembled Markdoc/markdown string (a shared page merged
// with its language overlays) into a renderable Markdoc node tree.
export function renderMarkdownString(opts: RenderOptions) {
  const {
    source,
    path,
    slug,
    version,
    languages,
    pageIndex,
    apiLinks,
    frontmatter
  } = opts;

  // One reading time per language: the page carries every mapping, and a
  // reader only reads theirs.
  const readingTime = Object.fromEntries(
    languages.map((language) => [
      language,
      readingTimeFunc(projectLanguage(source, language), {
        wordsPerMinute: 149
      }).text
    ])
  );

  const ast = parse(source);
  const variables: PageVariables = {
    frontmatter,
    path,
    slug,
    readingTime,
    version,
    languages,
    pageIndex,
    apiLinks,
    chrome: opts.chrome ?? {}
  };
  const updatedConfig: Config = { ...config, variables };
  return Markdoc.transform(ast, updatedConfig);
}
