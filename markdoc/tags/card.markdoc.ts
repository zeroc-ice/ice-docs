// Copyright (c) ZeroC, Inc.

import { nodes, Tag, type Node, type Config } from '@markdoc/markdoc';
import { resolveDocLink } from '../../lib/docs-model/links.ts';
import type { PageVariables } from '../../lib/markdown.ts';

/** The icons a card may name; components/tags/card.tsx draws them. */
export const CARD_ICONS = [
  'book',
  'boxes',
  'braces',
  'cpu',
  'rocket',
  'sliders'
] as const;

// Landing pages are built out of cards, so a card's href is resolved through the
// same page index as an ordinary link.
const card = {
  ...nodes.document,
  render: 'Card',
  attributes: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 3,
      required: false
    },
    icon: {
      type: String,
      required: false,
      matches: [...CARD_ICONS]
    }
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const { version, slug, pageIndex } = config.variables as PageVariables;
    const { href, resolved } = resolveDocLink(String(attributes.href ?? ''), {
      version,
      slug,
      index: pageIndex
    });
    return new Tag(
      'Card',
      { ...attributes, href, unresolved: !resolved },
      node.transformChildren(config)
    );
  }
};

export default card;
