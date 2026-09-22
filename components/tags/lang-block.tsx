// Copyright (c) ZeroC, Inc.

import type { ReactNode } from 'react';

// The wrapper an {% iflang %} renders to. `data-langs` is what the stylesheet
// keys on to show the reader's mapping and hide the others.
export const LangBlock = ({
  langs,
  inline,
  children
}: {
  langs: string[];
  inline?: boolean;
  children: ReactNode;
}) =>
  inline ? (
    <span data-langs={langs.join(' ')}>{children}</span>
  ) : (
    <div data-langs={langs.join(' ')}>{children}</div>
  );
