// Copyright (c) ZeroC, Inc.

import type { Schema } from '@markdoc/markdoc';

// A grid's children are card tags; `children` names node types, and tag
// children all surface as 'tag'.
const grid: Schema = {
  render: 'Grid',
  children: ['tag']
};

export default grid;
