// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

import type { PageVariables } from '../../lib/markdown.ts';

// The version and language the reader is looking at, as a pair of switches on
// the front page: the top bar's, with the same choices, made visible where a
// newcomer looks first.
const selection: Schema = {
  render: 'Selection',
  selfClosing: true,
  transform(_node: Node, config: Config) {
    const { version, languages, chrome } = config.variables as PageVariables;
    return new Tag('Selection', {
      version,
      languages,
      versionOptions: chrome.versionOptions ?? []
    });
  }
};

export default selection;
