// Copyright (c) ZeroC, Inc.

import { nodes, type Schema } from '@markdoc/markdoc';

// Markdoc's own `em`, `strong` and `s` schemas list the inline nodes they may
// contain and leave out the line break, so an emphasized phrase that Prettier
// wraps at 120 columns fails validation with "Can't nest 'softbreak' in 'em'".
// A line break inside emphasis renders as a space, like anywhere else in a
// paragraph; these schemas differ from Markdoc's only in allowing it.
const withBreaks = (schema: Schema): Schema => ({
  ...schema,
  children: [...(schema.children ?? []), 'softbreak', 'hardbreak']
});

export const em = withBreaks(nodes.em);
export const strong = withBreaks(nodes.strong);
export const s = withBreaks(nodes.s);
