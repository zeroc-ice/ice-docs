// Copyright (c) ZeroC, Inc.

import React from 'react';

type Props = {
  children: React.ReactNode;
  ordered?: boolean;
  /** First number of an ordered list, when the source does not start at 1. */
  start?: number;
};

export const List = ({ children, ordered, start }: Props) => {
  if (ordered) {
    return (
      <ol start={start} className="list-decimal">
        {children}
      </ol>
    );
  } else {
    return <ul className="list-disc">{children}</ul>;
  }
};
