// Copyright (c) ZeroC, Inc.

import type { Schema } from '@markdoc/markdoc';

/**
 * The kinds of callout, each with the label its heading shows. `compatibility`
 * is the version-availability note ("not available before Ice 3.8") that
 * multi-version docs need constantly; `deprecated` marks obsolete APIs and
 * behaviour.
 */
export const CALLOUT_LABELS = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  danger: 'Danger',
  deprecated: 'Deprecated',
  compatibility: 'Version compatibility'
} as const;

export type CalloutType = keyof typeof CALLOUT_LABELS;

const callout: Schema = {
  render: 'Callout',
  children: ['paragraph', 'tag', 'list', 'fence'],
  attributes: {
    type: {
      type: String,
      default: 'note',
      matches: Object.keys(CALLOUT_LABELS)
    },
    title: {
      type: String,
      required: false
    }
  }
};

export default callout;
