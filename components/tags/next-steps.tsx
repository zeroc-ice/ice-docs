// Copyright (c) ZeroC, Inc.

import { ReactNode } from 'react';

export const NextSteps = ({
  children,
  title = 'Next steps'
}: {
  children: ReactNode;
  title?: string;
}) => (
  <section aria-label={title} className="my-10 border-t border-hairline pt-6">
    <h2 className="mb-3 text-lg font-semibold text-ink">{title}</h2>
    <div className="text-sm leading-6 *:my-1">{children}</div>
  </section>
);
