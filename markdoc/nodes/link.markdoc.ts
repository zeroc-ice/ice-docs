// Copyright (c) ZeroC, Inc.

import { Tag, nodes, type Node, type Config } from '@markdoc/markdoc';
import { resolveDocLink, type PageIndex } from '../../lib/docs-model/links.ts';

// Cross-page links are authored as page names (`../object-adapters`) and resolved
// here, at build time, against the page index for the current version. Resolving
// them server-side (instead of relatively in the browser) means a page can move
// between sections without breaking every link to it.
const link = {
  render: 'AppLink',
  // Markdoc's own: `href` and `title`.
  attributes: nodes.link.attributes,
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const { version, pageIndex } = config.variables!;

    const { href, resolved } = resolveDocLink(String(attributes.href ?? ''), {
      version,
      index: pageIndex as PageIndex
    });

    return new Tag(
      'AppLink',
      { ...attributes, href, unresolved: !resolved },
      children
    );
  }
};

export default link;
