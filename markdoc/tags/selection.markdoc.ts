// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

// The version and language the reader is looking at, as a pair of switches on
// the front page: the top bar's, with the same targets, made visible where a
// newcomer looks first.
const selection: Schema = {
  render: 'Selection',
  selfClosing: true,
  transform(_node: Node, config: Config) {
    const variables = config.variables ?? {};
    return new Tag('Selection', {
      version: String(variables.version ?? ''),
      language: String(variables.language ?? ''),
      languageOptions: variables.languageOptions ?? [],
      versionOptions: variables.versionOptions ?? [],
      previousVersions: variables.previousVersions
    });
  }
};

export default selection;
