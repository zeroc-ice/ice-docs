// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';
import { resolveDocLink } from '../../lib/docs-model/links.ts';
import type { PageVariables } from '../../lib/markdown.ts';

// A row of the front page's release list. Its notes and platforms pages are
// named as a link names a page, and render as the same links, so they are
// resolved and checked like any other.
const release: Schema = {
  render: 'Release',
  attributes: {
    name: { type: String, required: true },
    notes: { type: String, required: true },
    platforms: { type: String, required: true },
    date: { type: String, required: true }
  },
  transform(node: Node, config: Config) {
    const { name, notes, platforms, date } = node.transformAttributes(
      config
    ) as Record<'name' | 'notes' | 'platforms' | 'date', string>;
    const { version, slug, pageIndex } = config.variables as PageVariables;
    const link = (page: string, text: string) => {
      const { href, resolved } = resolveDocLink(page, {
        version,
        slug,
        index: pageIndex
      });
      return new Tag('AppLink', { href, unresolved: !resolved }, [text]);
    };
    return new Tag('Release', { name, date }, [
      link(notes, 'Release notes'),
      link(platforms, 'Supported platforms')
    ]);
  }
};

export default release;
