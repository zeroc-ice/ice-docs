// Copyright (c) ZeroC, Inc.

import { ReactNode } from 'react';

// A labeled part of a property reference entry. The label is not a heading:
// the entry's heading is the property, and the outline lists properties alone.
const PropertySection = ({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) => (
  <section className="mt-5 [&>:first-child]:mt-0">
    <div className="mb-0.5 text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
      {label}
    </div>
    {children}
  </section>
);

export const PropertySynopsis = ({ children }: { children: ReactNode }) => (
  <PropertySection label="Synopsis">{children}</PropertySection>
);

export const PropertyDescription = ({ children }: { children: ReactNode }) => (
  <PropertySection label="Description">{children}</PropertySection>
);
