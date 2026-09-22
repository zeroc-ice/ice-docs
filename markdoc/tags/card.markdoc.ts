// Copyright (c) ZeroC, Inc.

import { nodes, Tag, type Node, type Config } from '@markdoc/markdoc';
import { resolveDocLink, type PageIndex } from '../../lib/docs-model/links.ts';

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
// same page index as an ordinary link — a card can name a page and keep working
// after that page moves.
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
    const { href, resolved } = resolveDocLink(String(attributes.href ?? ''), {
      version: String(config.variables?.version ?? ''),
      index: (config.variables?.pageIndex ?? {}) as PageIndex
    });
    return new Tag(
      'Card',
      { ...attributes, href, unresolved: !resolved },
      node.transformChildren(config)
    );
  }
};

export default card;
