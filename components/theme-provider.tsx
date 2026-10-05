// Copyright (c) ZeroC, Inc.

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
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
// own choice of theme has to reach the browser chrome too. The theme is the
// class on the html element, which next-themes sets after its effects run,
// so the tags follow the class itself rather than the React state.
function ThemeColor() {
  React.useEffect(() => {
    const follow = () => {
      const surface = getComputedStyle(document.documentElement)
        .getPropertyValue('--surface')
        .trim();
      for (const meta of document.querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]'
      )) {
        meta.content = surface;
      }
    };
    follow();
    const observer = new MutationObserver(follow);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
