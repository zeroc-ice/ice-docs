// Copyright (c) ZeroC, Inc.

import { nodes, type NodeType, type Schema } from '@markdoc/markdoc';

// Markdoc's own `em` and `strong` schemas list the inline nodes they may
// contain and leave out the line break, so an emphasized phrase that Prettier
// wraps at 120 columns fails validation with "Can't nest 'softbreak' in 'em'".
// A line break inside emphasis renders as a space, like anywhere else in a
// paragraph; these schemas differ from Markdoc's only in allowing it.
const breaks: NodeType[] = ['softbreak', 'hardbreak'];

export const em: Schema = {
  ...nodes.em,
  children: [...(nodes.em.children ?? []), ...breaks]
};

export const strong: Schema = {
  ...nodes.strong,
  children: [...(nodes.strong.children ?? []), ...breaks]
};
