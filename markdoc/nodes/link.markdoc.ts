// Copyright (c) ZeroC, Inc.

import { Tag, nodes, type Node, type Config } from '@markdoc/markdoc';
import {
  API_SCHEME,
  resolveApiLink,
  resolveDocLink
} from '../../lib/docs-model/links.ts';
import type { PageVariables } from '../../lib/markdown.ts';

// Cross-page links are authored as page names (`../object-adapters`) and resolved
// here, at build time, against the page index for the current version. Resolving
// them server-side (instead of relatively in the browser) means a page can move
// between sections without breaking every link to it.
//
// A link to a type in the API reference (`api:Ice/Communicator`) renders once
// for each language's page, wrapped as {% iflang %} text is, so the reader's
// shows; the languages with no page for the type get the link's text alone.
const link = {
  render: 'AppLink',
  // Markdoc's own: `href` and `title`.
  attributes: nodes.link.attributes,
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const { version, pageIndex, apiLinks, languages } =
      config.variables as PageVariables;
    const authored = String(attributes.href ?? '');

    if (authored.startsWith(API_SCHEME)) {
      const variants = resolveApiLink(
        authored.slice(API_SCHEME.length),
        languages,
        apiLinks
      );
      if (!variants)
        return new Tag(
          'AppLink',
          { ...attributes, unresolved: true },
          children
        );
      const linkOrText = (href: string) =>
        href
          ? [new Tag('AppLink', { ...attributes, href }, children)]
          : children;
      if (variants.length === 1) return linkOrText(variants[0].href);
      return variants.map(
        ({ href, langs }) =>
          new Tag('LangBlock', { langs, inline: true }, linkOrText(href))
      );
    }

    const { href, resolved } = resolveDocLink(authored, {
      version,
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
