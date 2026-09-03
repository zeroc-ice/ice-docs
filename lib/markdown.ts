// Copyright (c) ZeroC, Inc.

import Markdoc, { Config } from '@markdoc/markdoc';
import config from '@/markdoc/schema';
import { load as yamlLoad } from 'js-yaml';
import readingTimeFunc from 'reading-time';

import type { PageIndex } from '@/lib/docs-model/links';

export interface RenderOptions {
  /** The assembled page source (shared prose + language overlay + snippets). */
  source: string;
  /** The route this page is rendered at, e.g. `/ice/3.8/cpp/enumerations`. */
  path: string;
  version: string;
  language: string;
  /** Page index used to resolve cross-page links at build time. */
  pageIndex: PageIndex;
  /** Frontmatter to merge under the document's own (e.g. the shared page's). */
  frontmatter?: Record<string, unknown>;
  /** Navigation-derived page chrome: breadcrumbs, prev/next, body shape. */
  chrome?: Record<string, unknown>;
}

// Transform an already-assembled Markdoc/markdown string (a shared page merged
// with its language overlay) into a renderable Markdoc node tree.
export function renderMarkdownString(opts: RenderOptions) {
  const { source, path, version, language, pageIndex } = opts;

  const ast = Markdoc.parse(source);
  const frontmatter = {
    ...(opts.frontmatter ?? {}),
    ...(ast.attributes.frontmatter
      ? (yamlLoad(ast.attributes.frontmatter) as Record<string, unknown>)
      : {})
  };

  const readingTime = readingTimeFunc(source, { wordsPerMinute: 149 }).text;

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
      language,
      pageIndex,
      chrome: opts.chrome ?? {}
    }
  };
  return {
    content: Markdoc.transform(transformable, updatedConfig),
    frontmatter
  };
}
