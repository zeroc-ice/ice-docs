// Copyright (c) ZeroC, Inc.

import React, { ReactNode } from 'react';
import clsx from 'clsx';

import { Divider } from '@/components/divider';
import { HeadingCopyButton } from './heading-copy-button';

type Props = {
  id?: string;
  level: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
  showDividers?: boolean;
};

export const Heading = ({
  id = '',
  level = 1,
  children,
  showDividers = true
}: Props) => {
  const Component: React.ElementType = `h${level}`;
  return (
    <Component
      id={id}
      role="presentation"
      className={clsx('items-center *:hover:opacity-100', level !== 1 && 'group scroll-mt-28')}
    >
      <div className="flex items-center justify-start">
        <span role="heading" aria-level={level}>
          {children}
        </span>
        <HeadingCopyButton id={id} />
      </div>
      {/* A rule under every h3 as well turned each subsection into a banded
          block; the size step is enough to separate them. */}
      {level <= 2 && showDividers && <Divider margin="mt-3 mb-1" />}
    </Component>
  );
};
