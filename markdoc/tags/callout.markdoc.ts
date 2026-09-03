// Copyright (c) ZeroC, Inc.

import type { Schema } from '@markdoc/markdoc';

const callout: Schema = {
  render: 'Callout',
  children: ['paragraph', 'tag', 'list', 'fence'],
  attributes: {
    type: {
      type: String,
      default: 'note',
      // `compatibility` is the version-availability note ("not available before
      // Ice 3.8") that a multi-version manual needs constantly; `deprecated`
      // marks obsolete APIs and behaviour.
      matches: [
        'note',
        'info',
        'tip',
        'important',
        'warning',
        'danger',
        'deprecated',
        'compatibility'
      ]
    },
    title: {
      type: String,
      required: false
    }
  }
};

export default callout;
