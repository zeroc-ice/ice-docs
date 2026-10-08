// Copyright (c) ZeroC, Inc.
//
// The Markdoc schema without its React components: the tags and nodes, which
// is all that parsing and validation need. `schema.ts` adds the components for
// rendering. `scripts/check-markdoc.ts` loads this file under plain Node, which
// is why the imports here and in the modules below name their `.ts` files.

import type { Config } from '@markdoc/markdoc';

import * as nodes from './nodes/index.ts';
import * as tags from './tags/index.ts';
import nextSteps from './tags/next-steps.markdoc.ts';
import propertyDescription from './tags/property-description.markdoc.ts';
import propertySynopsis from './tags/property-synopsis.markdoc.ts';

const config: Config = {
  tags: {
    ...tags,
    // Markup name is kebab-case, so it cannot be a module export identifier.
    'next-steps': nextSteps,
    'property-description': propertyDescription,
    'property-synopsis': propertySynopsis
  },
  nodes: {
    ...nodes
  },
  variables: {}
};

export default config;
