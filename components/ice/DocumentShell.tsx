// Copyright (c) ZeroC, Inc.

import { ReactElement } from 'react';
import Link from 'next/link';

import { PageTypeBadge } from '@/components/ice/PageTypeBadge';
import { PageOutline } from '@/components/ice/PageOutline';
import type { PageType } from '@/lib/docs-model/nav';
import { Callout } from '@/components/tags/callout';
import { LanguageNotice } from '@/components/ice/LanguageNotice';

interface Heading {
  title?: string;
  id?: string;
  level?: number;
  langs?: string[];
}

interface Crumb {
  title: string;
  href?: string;
}

interface PageLink {
  title: string;
  href: string;
}

interface Pagination {
  /** The languages whose readers get these neighbors. */
  langs: string[];
  prev?: PageLink;
  next?: PageLink;
}

interface DocumentShellProps {
  children: ReactElement[] | ReactElement;
  title?: string;
  description?: string;
  type?: PageType;
  /** By language mapping: the page carries every mapping, and a reader reads theirs. */
  readingTime?: Record<string, string>;
  /** The manual's languages. */
  languages: string[];
  /** The languages the page is written for; absent when it is written for all. */
  writtenFor?: string[];
  headings?: Heading[];
  breadcrumbs?: Crumb[];
  pagination: Pagination[];
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
  languages,
  writtenFor,
  headings = [],
  breadcrumbs = [],
  pagination,
  showAside = true,
  shape
}: DocumentShellProps) => {
  const toc = headings
    .filter((h) => h && h.id && (h.level === 2 || h.level === 3))
    .map((h) => ({
      id: h.id!,
      title: h.title ?? '',
      level: h.level!,
      langs: h.langs
    }));
  const notWrittenFor = writtenFor
    ? languages.filter((language) => !writtenFor.includes(language))
    : [];

  return (
    <div className="flex shrink flex-row justify-center overflow-y-clip lg:justify-start">
      {/* The breadcrumbs are navigation rather than part of the article, so
          they sit above it in the page's column, clear of the article's prose
          styles. */}
      <div className="mx-6 size-full max-w-232 min-w-0 md:mx-10 lg:mx-12">
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 text-[13px] text-ink-secondary"
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
                      className="font-medium text-link transition-colors hover:text-ink"
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

        <article data-page-shape={shape}>
          {title && (
            <header className="mb-10">
              {type && (
                <div className="mb-2">
                  <PageTypeBadge type={type} />
                </div>
              )}
              <h1>{title}</h1>
              {description && (
                <p className="mt-3 text-lg text-ink-secondary">{description}</p>
              )}
              {/* "1 min read" under a one-sentence signpost is noise; the time
                earns its place on an article long enough that the reader is
                deciding whether to start now. */}
              {Object.entries(readingTime ?? {})
                .filter(([, text]) => Number.parseInt(text, 10) >= 2)
                .map(([language, text]) => (
                  <p
                    key={language}
                    data-langs={language}
                    className="mt-2 text-[13px] text-ink-muted"
                  >
                    {text}
                  </p>
                ))}
            </header>
          )}

          {writtenFor && notWrittenFor.length > 0 && (
            <div data-langs={notWrittenFor.join(' ')}>
              <Callout type="note">
                <LanguageNotice writtenFor={writtenFor} />
              </Callout>
            </div>
          )}

          <div className="doc-body" style={{ counterReset: 'step-counter' }}>
            {children}
          </div>

          {pagination
            .filter(({ prev, next }) => prev || next)
            .map(({ langs, prev, next }) => (
              <nav
                key={langs.join(' ')}
                data-langs={langs.join(' ')}
                aria-label="Pagination"
                className="mt-14 flex gap-3 border-t border-hairline pt-5 text-sm"
              >
                {/* Text links, not cards. A bordered half-width card gives "the next
                page in this section" the same visual weight as the article, which
                is conspicuous on a short page where the card is most of it. */}
                {prev ? (
                  <Link href={prev.href} className="group min-w-0 flex-1">
                    <div className="text-[11px] font-semibold tracking-[0.04em] text-ink-muted uppercase">
                      Previous
                    </div>
                    <div className="mt-0.5 truncate font-medium text-ink transition-colors group-hover:text-link">
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
                    <div className="text-[11px] font-semibold tracking-[0.04em] text-ink-muted uppercase">
                      Next
                    </div>
                    <div className="mt-0.5 truncate font-medium text-ink transition-colors group-hover:text-link">
                      {next.title}
                      <span aria-hidden="true"> →</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </nav>
            ))}
        </article>
      </div>

      {showAside && (
        <PageOutline
          headings={toc}
          languages={languages}
          writtenFor={writtenFor}
        />
      )}
    </div>
  );
};
