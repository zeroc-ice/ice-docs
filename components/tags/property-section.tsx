// Copyright (c) ZeroC, Inc.

import { ReactNode } from 'react';

// A labeled part of a property reference entry. The label is not a heading:
// the entry's heading is the property, and the outline lists properties alone.
// The section has no box of its own, so what it holds sits on the article's
// width tracks like any other block; the first node after the label, or the
// first inside a language block there, closes up to it.
const PropertySection = ({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) => (
  <section className="property-section contents [&>:nth-child(2)]:mt-0 [&>[data-langs]:nth-child(2)>:first-child]:mt-0">
    <div className="mt-5 mb-0.5 text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
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
