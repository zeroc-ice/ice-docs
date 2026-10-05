// Copyright (c) ZeroC, Inc.

import type { Schema } from '@markdoc/markdoc';

// The front page's release list: a release tag per release, newest first.
const releases: Schema = {
  render: 'Releases',
  children: ['tag']
};

export default releases;
