// Copyright (c) ZeroC, Inc.

import {
  Tag,
  Node,
  Config,
  RenderableTreeNode,
  type Schema
} from '@markdoc/markdoc';

const heading: Schema = {
  render: 'Heading',
  children: ['inline'],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
    className: { type: String }
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const id = generateID(children, attributes);
    const frontmatter = config.variables?.frontmatter;
    const showDividers = frontmatter.showDividers;
    return new Tag(
      `${this.render}`,
      { ...attributes, id, showDividers, text: headingText(children) },
      children
    );
  }
};

/**
 * The visible text of a heading, inline markup included.
 *
 * The property reference writes its headings as `# *adapter*.AdapterId`, so a
 * version that only looked at the plain-string children produced the anchor
 * `#.adapterid` — the identifier's first half silently dropped out of every
 * link to it.
 */
export function headingText(children: RenderableTreeNode[]): string {
  let text = '';
  for (const child of children) {
    if (typeof child === 'string') text += child;
    else if (child && typeof child === 'object' && 'children' in child) {
      text += headingText((child as Tag).children ?? []);
    }
  }
  return text;
}

function generateID(children: RenderableTreeNode[], attributes: Record<string, unknown>) {
  if (attributes.id && typeof attributes.id === 'string') {
    return attributes.id;
  }

  return headingText(children)
    .replace(/[?]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export default heading;
