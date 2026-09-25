// Copyright (c) ZeroC, Inc.

import { ReactNode, Fragment, Children } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  columns?: number;
};

export const Grid = ({ children }: Props) => {
  return (
    <>
      <div
        // Cards stretch to the tallest in their row (the grid default). A row of
        // ragged bottom edges reads as a list of unrelated things; a shared
        // baseline reads as a set of siblings you are meant to choose between,
        // which is what a landing page is for. Rows size independently, so a
        // long description only affects the row it is in.
        className={clsx('my-8 grid grid-cols-1 gap-4 md:grid-cols-3')}
      >
        {Children.toArray(children).map((child, index) => {
          return <Fragment key={index}>{child}</Fragment>;
        })}
      </div>
    </>
  );
};
