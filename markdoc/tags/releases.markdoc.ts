// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

// The releases of this version, from the Release Notes chapter ($releases), so
// the front page lists a new release as soon as it is in navigation.yaml.
const releases: Schema = {
  render: 'Releases',
  selfClosing: true,
  transform(_node: Node, config: Config) {
    return new Tag('Releases', {
      pages: config.variables?.releases ?? []
    });
  }
};

export default releases;
