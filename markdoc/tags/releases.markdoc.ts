// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

import type { PageVariables } from '../../lib/markdown.ts';

// The releases of this version, from the Release Notes chapter by way of the
// chrome the route provides, so the front page lists a new release as soon as
// the Release Notes page lists it.
const releases: Schema = {
  render: 'Releases',
  selfClosing: true,
  transform(_node: Node, config: Config) {
    const { chrome } = config.variables as PageVariables;
    return new Tag('Releases', { pages: chrome.releases ?? [] });
  }
};

export default releases;
