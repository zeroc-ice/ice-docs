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
      // `info` and `success` are what the migrated manual writes for a note
      // and a tip; the component renders them as such.
      matches: [
        'note',
        'info',
        'tip',
        'success',
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
