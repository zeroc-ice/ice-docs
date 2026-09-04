// Copyright (c) ZeroC, Inc.

import { nodes } from '@markdoc/markdoc';

// Markdoc's own attributes (`ordered`, `start`, `marker`), so the schema cannot
// fall behind the parser; `ordered` is rendered, since the component picks the
// element from it.
const list = {
  render: 'List',
  attributes: {
    ...nodes.list.attributes,
    ordered: { type: Boolean }
  }
};

export default list;
