// Copyright (c) ZeroC, Inc.

import { Tag, Node, Config } from '@markdoc/markdoc';
import { resolveDocLink, type PageIndex } from '@/lib/docs-model/links';

// Cross-page links are authored as page names (`../object-adapters`) and resolved
// here, at build time, against the page index for the current version. Resolving
// them server-side (instead of relatively in the browser) means a page can move
// between sections without breaking every link to it.
const link = {
  render: 'AppLink',
  attributes: {
    href: {
      type: String
    }
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const index = (config.variables?.pageIndex ?? {}) as PageIndex;

    const { href, resolved } = resolveDocLink(String(attributes.href ?? ''), {
      version: String(config.variables?.version ?? ''),
      language: String(config.variables?.language ?? ''),
      index
    });

    return new Tag('AppLink', { ...attributes, href, unresolved: !resolved }, children);
  }
};

export default link;
