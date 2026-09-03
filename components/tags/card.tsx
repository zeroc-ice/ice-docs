// Copyright (c) ZeroC, Inc.

import { ArrowRight } from 'lucide-react';

import { AppLink } from '@/components/nodes/app-link';

type CardProps = {
  title: string;
  description: string;
  href: string;
  level?: 1 | 2 | 3 | 4 | 5;
  /** Set when the href names a page that is not in the index. */
  unresolved?: boolean;
};

// A navigation card on a landing page. The title is ordinary dark text with an
// arrow that arrives on hover, not blue: a grid of blue headings makes the whole
// page look like a link list and drains the meaning out of the inline links in
// the prose around it.
export const Card = ({ title, description, href, level = 3, unresolved }: CardProps) => {
  return (
    <AppLink
      href={href}
      unresolved={unresolved}
      className="group border-hairline bg-surface hover:border-link/40 col-span-1 block rounded-[10px] border px-5 py-4 transition duration-150 hover:-translate-y-px hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
      showArrow={false}
    >
      <div
        className="text-ink group-hover:text-link m-0 flex items-center gap-1.5 font-semibold transition-colors"
        role="heading"
        aria-level={level}
      >
        {title}
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 -translate-x-1 opacity-0 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
      <div className="text-ink-secondary my-0 mt-1.5 text-sm leading-relaxed">{description}</div>
    </AppLink>
  );
};
