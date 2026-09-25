// Copyright (c) ZeroC, Inc.

import {
  ArrowRight,
  BookOpen,
  Boxes,
  Braces,
  Cpu,
  Rocket,
  SlidersHorizontal,
  type LucideIcon
} from 'lucide-react';

import { AppLink } from '@/components/nodes/app-link';
import { CARD_ICONS } from '@/markdoc/tags/card.markdoc';

type CardIcon = (typeof CARD_ICONS)[number];

const ICONS: Record<CardIcon, LucideIcon> = {
  book: BookOpen,
  boxes: Boxes,
  braces: Braces,
  cpu: Cpu,
  rocket: Rocket,
  sliders: SlidersHorizontal
};

type CardProps = {
  title: string;
  description: string;
  href: string;
  level?: 1 | 2 | 3 | 4 | 5;
  icon?: CardIcon;
  /** Set when the href names a page that is not in the index. */
  unresolved?: boolean;
};

// A navigation card on a landing page. The title is ordinary dark text with an
// arrow that arrives on hover, not blue: a grid of blue headings makes the whole
// page look like a link list and drains the meaning out of the inline links in
// the prose around it.
export const Card = ({
  title,
  description,
  href,
  level = 3,
  icon,
  unresolved
}: CardProps) => {
  const Icon = icon ? ICONS[icon] : undefined;
  return (
    <AppLink
      href={href}
      unresolved={unresolved}
      className="group col-span-1 block rounded-[10px] border border-hairline bg-surface p-5 transition duration-150 hover:-translate-y-px hover:border-link/40 hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
      showArrow={false}
    >
      {Icon && (
        <span
          aria-hidden="true"
          className="mb-3 flex size-9 items-center justify-center rounded-lg bg-accent-soft text-link"
        >
          <Icon className="size-[18px]" />
        </span>
      )}
      <div
        className="m-0 flex items-center gap-1.5 font-semibold text-ink transition-colors group-hover:text-link"
        role="heading"
        aria-level={level}
      >
        {title}
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 -translate-x-1 opacity-0 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
      <div className="my-0 mt-1.5 text-sm leading-relaxed text-ink-secondary">
        {description}
      </div>
    </AppLink>
  );
};
