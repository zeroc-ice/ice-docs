// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

// The releases of this version, from the Release Notes chapter by way of the
// chrome the route provides, so the front page lists a new release as soon as
// the Release Notes page lists it.
const releases: Schema = {
  render: 'Releases',
  selfClosing: true,
  transform(_node: Node, config: Config) {
    return new Tag('Releases', {
      pages: config.variables?.chrome?.releases ?? []
    });
  }
};

export default releases;
