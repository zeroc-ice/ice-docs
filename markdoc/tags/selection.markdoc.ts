// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

// The version and language the reader is looking at, as a pair of switches on
// the front page: the top bar's, with the same choices, made visible where a
// newcomer looks first.
const selection: Schema = {
  render: 'Selection',
  selfClosing: true,
  transform(_node: Node, config: Config) {
    const variables = config.variables ?? {};
    const chrome = variables.chrome ?? {};
    return new Tag('Selection', {
      version: String(variables.version ?? ''),
      languages: variables.languages,
      versionOptions: chrome.versionOptions ?? [],
      previousVersions: chrome.previousVersions
    });
  }
};

export default selection;
