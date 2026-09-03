// Copyright (c) ZeroC, Inc.

import { ReactElement } from 'react';
import Link from 'next/link';

import { PageTypeBadge } from '@/components/ice/PageTypeBadge';
import { PageOutline } from '@/components/ice/PageOutline';
import type { PageType } from '@/lib/docs-model/nav';

interface Heading {
  title?: string;
  id?: string;
  level?: number;
}

interface Crumb {
  title: string;
  href?: string;
}

interface PageLink {
  title: string;
  href: string;
}

interface DocumentShellProps {
  children: ReactElement[] | ReactElement;
  title?: string;
  description?: string;
  type?: PageType;
  readingTime?: string;
  headings?: Heading[];
  breadcrumbs?: Crumb[];
  prev?: PageLink;
  next?: PageLink;
  showAside?: boolean;
  /** Body layout when the page is not ordinary prose, e.g. "property-list". */
  shape?: string;
}

// The one page template every article uses, so a reader can recognize the kind
// of page from its shape alone (Microsoft Learn's most useful property):
//
//   breadcrumb -> title -> reading time -> article
//   with "On this page" pinned to the right. A page whose frontmatter declares
//   a Diátaxis `type` gets a kind badge above its title.
//
// The badge sits above the title rather than beside it: titles here range from
// "Facets" to "Well-Known Objects and Object Adapter Endpoints", and a badge on
// the baseline of a two-line title lands in the wrong place every time.
export const DocumentShell = ({
  children,
  title,
  description,
  type,
  readingTime,
  headings = [],
  breadcrumbs = [],
  prev,
  next,
  showAside = true,
  shape
}: DocumentShellProps) => {
  const toc = headings
    .filter((h) => h && h.id && (h.level === 2 || h.level === 3))
    .map((h) => ({ id: h.id!, title: h.title ?? '', level: h.level! }));

  return (
    <div className="flex shrink flex-row justify-center overflow-y-clip lg:justify-start">
      <article
        data-page-shape={shape}
        className="mx-6 size-full max-w-232 min-w-0 md:mx-10 lg:mx-12"
      >
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="text-ink-secondary mb-5 text-[13px]"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-ink-disabled">
                      /
                    </span>
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-ink transition-colors"
                    >
                      {crumb.title}
                    </Link>
                  ) : (
                    <span>{crumb.title}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {title && (
          <header className="mb-10">
            {type && (
              <div className="mb-2">
                <PageTypeBadge type={type} />
              </div>
            )}
            <h1>{title}</h1>
            {description && (
              <p className="text-ink-secondary mt-3 text-lg">{description}</p>
            )}
            {showReadingTime(readingTime) && (
              <p className="text-ink-muted mt-2 text-[13px]">{readingTime}</p>
            )}
          </header>
        )}

        <div className="doc-body" style={{ counterReset: 'step-counter' }}>
          {children}
        </div>

        {(prev || next) && (
          <nav
            aria-label="Pagination"
            className="border-hairline mt-14 flex gap-3 border-t pt-5 text-sm"
          >
            {/* Text links, not cards. A bordered half-width card gives "the next
                page in this section" the same visual weight as the article, which
                is conspicuous on a short page where the card is most of it. */}
            {prev ? (
              <Link href={prev.href} className="group min-w-0 flex-1">
                <div className="text-ink-muted text-[11px] font-semibold tracking-[0.04em] uppercase">
                  Previous
                </div>
                <div className="text-ink group-hover:text-link mt-0.5 truncate font-medium transition-colors">
                  <span aria-hidden="true">← </span>
                  {prev.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={next.href}
                className="group min-w-0 flex-1 text-right"
              >
                <div className="text-ink-muted text-[11px] font-semibold tracking-[0.04em] uppercase">
                  Next
                </div>
                <div className="text-ink group-hover:text-link mt-0.5 truncate font-medium transition-colors">
                  {next.title}
                  <span aria-hidden="true"> →</span>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
      </article>

      {showAside && <PageOutline headings={toc} />}
    </div>
  );
};

/**
 * Whether the reading time is worth printing.
 *
 * "1 min read" under a one-sentence signpost is noise: it takes a line of the
 * page to tell the reader something they can already see. It earns its place on
 * an article long enough that the reader is deciding whether to start now.
 */
function showReadingTime(readingTime: string | undefined): boolean {
  if (!readingTime) return false;
  const minutes = Number.parseInt(readingTime, 10);
  return Number.isNaN(minutes) || minutes >= 2;
}
