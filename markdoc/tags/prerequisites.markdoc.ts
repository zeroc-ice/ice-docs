// Copyright (c) ZeroC, Inc.

import type { Schema } from '@markdoc/markdoc';

// What the reader must already have before starting a tutorial or how-to guide.
// A dedicated tag (rather than a prose paragraph) so it always renders in the
// same place, in the same shape, on every task-oriented page.
const prerequisites: Schema = {
  render: 'Prerequisites',
  children: ['paragraph', 'list', 'tag'],
  attributes: {
    title: {
      type: String,
      default: 'Before you begin'
    }
  }
};

export default prerequisites;
