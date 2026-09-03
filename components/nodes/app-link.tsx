// Copyright (c) ZeroC, Inc.

'use client';

import { ReactNode, CSSProperties } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type AppLinkProps = {
  href: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  showArrow?: boolean;
  /** Set by the link node when the href names a page that is not in the index. */
  unresolved?: boolean;
  children: ReactNode;
};

// Default styles for the link.
const defaultStyle: CSSProperties = { textUnderlineOffset: '5px' };

// Links arrive here already resolved: the link node rewrote page names into site
// URLs at build time. What is left to decide is how a link looks — an external
// link gets an arrow, and a link to a page that does not exist is shown as text
// rather than as a dead link.
export const AppLink = ({
  href,
  target,
  className = 'text-link hover:text-link-hover font-medium',
  style: originalStyle,
  showArrow = true,
  unresolved = false,
  children
}: AppLinkProps) => {
  const style = { ...defaultStyle, ...originalStyle };
  const external = isExternalLink(href);

  if (unresolved) {
    return (
      <span
        className={clsx(
          className,
          'cursor-help underline decoration-dotted underline-offset-4 opacity-60'
        )}
        style={style}
        title={`This page is not available yet (${href})`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      prefetch={external ? false : undefined}
      className={className}
      style={style}
    >
      <span className={clsx(external && showArrow && 'with-arrow whitespace-nowrap')}>
        {children}
      </span>

      <style jsx>{`
        .with-arrow::after {
          content: '';
          display: inline-block;
          width: 16px;
          height: 16px;
          background-image: url('/images/link_arrow.svg');
          background-repeat: no-repeat;
          background-size: cover;
          transform: scale(0.52);
          transform-origin: 55% 70%;
        }

        :global(html.dark) .with-arrow::after {
          background-image: url('/images/link_arrow_dark.svg');
        }
      `}</style>
    </Link>
  );
};

const isExternalLink = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://');
