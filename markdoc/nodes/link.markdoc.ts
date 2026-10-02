// Copyright (c) ZeroC, Inc.

import { Tag, nodes, type Node, type Config } from '@markdoc/markdoc';
import { resolveDocLink } from '../../lib/docs-model/links.ts';
import type { PageVariables } from '../../lib/markdown.ts';

// Cross-page links name a page by its slug (`runtime/object-adapters`) or by a
// path relative to this page (`../object-adapters`), and are resolved here, at
// build time, against the page index for the current version, so a link to a
// page that does not exist is reported instead of rendered.
const link = {
  render: 'AppLink',
  // Markdoc's own: `href` and `title`.
  attributes: nodes.link.attributes,
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const { version, slug, pageIndex } = config.variables as PageVariables;

    const { href, resolved } = resolveDocLink(String(attributes.href ?? ''), {
      version,
      slug,
      index: pageIndex
    });

    return new Tag(
      'AppLink',
      { ...attributes, href, unresolved: !resolved },
      children
    );
  }
};

export default link;
