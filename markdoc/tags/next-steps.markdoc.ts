// Copyright (c) ZeroC, Inc.

import type { Schema } from '@markdoc/markdoc';

// Curated links that continue the reader's journey. The sequential previous/next
// footer is mechanical (sidebar order); this is the author's deliberate
// "where you probably want to go now", and may point into another section.
const nextSteps: Schema = {
  render: 'NextSteps',
  children: ['paragraph', 'list', 'tag'],
  attributes: {
    title: {
      type: String,
      default: 'Next steps'
    }
  }
};

export default nextSteps;
