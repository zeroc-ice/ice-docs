// Copyright (c) ZeroC, Inc.

import Markdoc, { Config } from '@markdoc/markdoc';
import config from '@/markdoc/schema';
import readingTimeFunc from 'reading-time';
import { projectLanguage } from './project-language.ts';

import type { PageIndex } from '@/lib/docs-model/links';

export interface RenderOptions {
  /** The assembled page source (shared prose + every language overlay + snippets). */
  source: string;
  /** The route this page is rendered at, e.g. `/ice/3.8/slice/enumerations`. */
  path: string;
  version: string;
  /** The manual's languages, for what is computed once per language. */
  languages: string[];
  /** Page index used to resolve cross-page links at build time. */
  pageIndex: PageIndex;
  /** The page's frontmatter. */
  frontmatter: Record<string, unknown>;
  /** Navigation-derived page chrome: breadcrumbs, prev/next, body shape. */
  chrome?: Record<string, unknown>;
}

// Transform an already-assembled Markdoc/markdown string (a shared page merged
// with its language overlays) into a renderable Markdoc node tree.
export function renderMarkdownString(opts: RenderOptions) {
  const { source, path, version, languages, pageIndex, frontmatter } = opts;

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

  const tokenizer = new Markdoc.Tokenizer({ allowComments: true });
  const tokens = tokenizer.tokenize(source);
  const transformable = Markdoc.parse(tokens);
  const updatedConfig: Config = {
    ...config,
    variables: {
      frontmatter,
      path,
      readingTime,
      version,
      languages,
      pageIndex,
      chrome: opts.chrome ?? {}
    }
  };
  return Markdoc.transform(transformable, updatedConfig);
}
