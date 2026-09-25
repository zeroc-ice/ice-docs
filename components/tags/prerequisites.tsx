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
    className="my-6 rounded-md border border-hairline bg-surface-subtle p-4"
  >
    <div className="mb-2 text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
      {title}
    </div>
    <div className="text-sm leading-6 *:my-1">{children}</div>
  </section>
);
