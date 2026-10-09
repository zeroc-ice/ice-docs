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

// Sets the theme-color meta tags to the page surface of the theme in force:
// the class on the html element, which next-themes sets. Serialized into the
// page as an inline script, so it must stand on its own: no imports, no
// closure over anything in this module.
function followTheme() {
  const surface = getComputedStyle(document.documentElement)
    .getPropertyValue('--surface')
    .trim();
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute('content', surface);
  }
}

const followThemeScript = `(${followTheme.toString()})()`;

// The page's theme-color meta tags follow the OS preference; the reader's
// own choice of theme has to reach the browser chrome too, from the first
// paint on. The script runs right after the one next-themes puts ahead of
// it, which applies the class; the observer follows every switch after that.
function ThemeColor() {
  React.useEffect(() => {
    const observer = new MutationObserver(followTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);
  return <script dangerouslySetInnerHTML={{ __html: followThemeScript }} />;
}
