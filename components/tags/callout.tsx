// Copyright (c) ZeroC, Inc.

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode
} from 'react';
import { clsx } from 'clsx';
import {
  CircleAlert,
  GitCompareArrows,
  Info,
  Lightbulb,
  OctagonAlert,
  PackageMinus,
  TriangleAlert,
  type LucideIcon
} from 'lucide-react';

import { CodeBlock } from '@/components/code-block';

export type CalloutType =
  | 'note'
  | 'info'
  | 'tip'
  | 'important'
  | 'warning'
  | 'danger'
  | 'deprecated'
  | 'compatibility';

// One component, seven intents, deliberately unequal in weight. Most callouts in
// docs this size are notes; if every note looked urgent, a warning would
// stop meaning anything. Only the icon, the label and the left edge carry the
// intent's colour — the body text stays the same near-black as the surrounding
// prose so the callout reads as an annotation, not as a second page.
//
// A callout is for information a reader can skip without losing the thread. If
// removing it would break the explanation, it belongs in the prose.
const INTENTS: Record<
  CalloutType,
  { label: string; icon: LucideIcon; className: string }
> = {
  note: { label: 'Note', icon: Info, className: 'callout-note' },
  // The migrated pages write `type="info"`; it is the same thing as a note.
  info: { label: 'Note', icon: Info, className: 'callout-note' },
  tip: { label: 'Tip', icon: Lightbulb, className: 'callout-tip' },
  important: {
    label: 'Important',
    icon: CircleAlert,
    className: 'callout-important'
  },
  warning: {
    label: 'Warning',
    icon: TriangleAlert,
    className: 'callout-warning'
  },
  danger: { label: 'Danger', icon: OctagonAlert, className: 'callout-danger' },
  deprecated: {
    label: 'Deprecated',
    icon: PackageMinus,
    className: 'callout-deprecated'
  },
  // Version and platform differences — the note that docs covering several Ice
  // releases need constantly ("not available before Ice 3.8").
  compatibility: {
    label: 'Version compatibility',
    icon: GitCompareArrows,
    className: 'callout-compatibility'
  }
};

type Props = {
  children: ReactNode;
  type: CalloutType;
  title?: string;
};

// A code sample nested in a callout is an illustration of the sentence above it,
// so it drops the language header and the copy bar it would carry as a top-level
// block. Without this a one-line `using` declaration arrives as a second card
// inside the first one.
function quietCodeBlocks(children: ReactNode): ReactNode {
  return Children.map(children, (child) =>
    isValidElement(child) && child.type === CodeBlock
      ? cloneElement(child as ReactElement<{ showTitle?: boolean }>, {
          showTitle: false
        })
      : child
  );
}

export const Callout = ({ children, type = 'note', title }: Props) => {
  const intent = INTENTS[type] ?? INTENTS.note;
  const Icon = intent.icon;

  return (
    <aside className={clsx('callout', intent.className)}>
      <div className="callout-heading">
        <Icon aria-hidden="true" strokeWidth={2.25} />
        <span>{title ?? intent.label}</span>
      </div>
      <div className="callout-content">{quietCodeBlocks(children)}</div>
    </aside>
  );
};
