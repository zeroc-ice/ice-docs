// Copyright (c) ZeroC, Inc.

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeColor />
      {children}
    </NextThemesProvider>
  );
}

// The page's theme-color meta tags follow the OS preference; the reader's
// own choice of theme has to reach the browser chrome too.
function ThemeColor() {
  const { resolvedTheme } = useTheme();
  React.useEffect(() => {
    const surface = getComputedStyle(document.documentElement)
      .getPropertyValue('--surface')
      .trim();
    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]'
    )) {
      meta.content = surface;
    }
  }, [resolvedTheme]);
  return null;
}
