// Copyright (c) ZeroC, Inc.

import { ReactNode } from 'react';

export const Prerequisites = ({
  children,
  title = 'Before you begin'
}: {
  children: ReactNode;
  title?: string;
}) => (
  <section
    aria-label={title}
    className="border-hairline bg-surface-subtle my-6 rounded-md border p-4"
  >
    <div className="text-ink-muted mb-2 text-[11px] font-semibold uppercase tracking-[0.07em]">
      {title}
    </div>
    <div className="*:my-1 text-sm leading-6">{children}</div>
  </section>
);
