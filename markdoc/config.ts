// Copyright (c) ZeroC, Inc.
//
// The Markdoc schema without its React components: the tags and nodes, which
// is all that parsing and validation need. `schema.ts` adds the components for
// rendering. `scripts/check-markdoc.mjs` loads this file under plain Node, which
// is why the imports here and in the modules below name their `.ts` files.

import type { Config } from '@markdoc/markdoc';

import * as nodes from './nodes/index.ts';
import * as tags from './tags/index.ts';
import nextSteps from './tags/next-steps.markdoc.ts';

const config: Config = {
  tags: {
    ...tags,
    // Markup name is kebab-case, so it cannot be a module export identifier.
    'next-steps': nextSteps
  },
  nodes: {
    ...nodes
  },
  variables: {}
};

export default config;
