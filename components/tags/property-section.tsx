// Copyright (c) ZeroC, Inc.

import { ReactNode } from 'react';

// A labeled part of a property reference entry. The label is not a heading:
// the entry's heading is the property, and the outline lists properties alone.
// A language block has no box of its own, so the first node inside one sits
// against the label like any other first node.
const PropertySection = ({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) => (
  <section className="mt-5">
    <div className="mb-0.5 text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
      {label}
    </div>
    <div className="[&>:first-child]:mt-0 [&>[data-langs]:first-child>:first-child]:mt-0">
      {children}
    </div>
  </section>
);

export const PropertySynopsis = ({ children }: { children: ReactNode }) => (
  <PropertySection label="Synopsis">{children}</PropertySection>
);

export const PropertyDescription = ({ children }: { children: ReactNode }) => (
  <PropertySection label="Description">{children}</PropertySection>
);
