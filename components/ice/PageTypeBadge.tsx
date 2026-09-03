// Copyright (c) ZeroC, Inc.

import type { PageType } from '@/lib/docs-model/nav';

// The Diátaxis form of a page, shown above its title. The point is not the
// vocabulary — readers never see the word "Diátaxis" — it is that a reader can
// tell at a glance whether a page will teach them, walk them through a task,
// explain a design, or list exact facts.
//
// It is a label, not an ornament: small, square-ish and low-saturation, so it
// reads as metadata beside a heading rather than as a button.
const LABELS: Record<PageType, { label: string; className: string }> = {
  tutorial: {
    label: 'Tutorial',
    className: 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300'
  },
  'how-to': {
    label: 'How-to',
    className: 'bg-blue-500/10 text-blue-800 dark:bg-blue-400/10 dark:text-blue-300'
  },
  concept: {
    label: 'Concept',
    className: 'bg-violet-500/10 text-violet-800 dark:bg-violet-400/10 dark:text-violet-300'
  },
  reference: {
    label: 'Reference',
    className: 'bg-amber-500/10 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300'
  },
  troubleshooting: {
    label: 'Troubleshooting',
    className: 'bg-rose-500/10 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300'
  },
  'release-note': {
    label: 'Release notes',
    className: 'bg-slate-500/10 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300'
  }
};

export function PageTypeBadge({ type }: { type: PageType }) {
  const entry = LABELS[type];
  if (!entry) return null;
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] ${entry.className}`}
    >
      {entry.label}
    </span>
  );
}
