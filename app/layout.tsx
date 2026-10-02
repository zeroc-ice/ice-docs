// Copyright (c) ZeroC, Inc.

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AnchorScroll } from '@/components/ice/AnchorScroll';
import { IceHeader } from '@/components/ice/Header';
import { Footer } from '@/components/ice/Footer';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
  LANGUAGE_STORAGE_KEY,
  SITE_TITLE
} from '@/lib/docs-model/nav';
import { NOINDEX, SITE_URL } from '@/lib/site';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`
  },
  description:
    'Learn how to develop and deploy networked applications with Ice.',
  keywords: [
    'Ice',
    'ZeroC',
    'RPC',
    'networking',
    'documentation',
    'docs',
    'guide'
  ],
  robots: {
    index: !NOINDEX,
    follow: !NOINDEX
  }
};

// Applies the reader's language mapping before the first paint, so the page
// never shows one mapping and then switches to theirs: a `?lang=` in the URL,
// which a link can carry, else the stored choice. The query is stored as the
// choice and dropped from the address, so the URL a reader copies stays clean.
// The attribute it sets is what the stylesheet keys on; see context/state.tsx.
// Serialized into the page as an inline script, so it must stand on its own:
// no imports, no closure over anything in this module.
function applyLanguage(known: string[], key: string) {
  const url = new URL(location.href);
  const query = url.searchParams.get('lang');
  let language: string | null = null;
  try {
    language = localStorage.getItem(key);
  } catch {
    // Storage blocked: the query, if there is one, still applies.
  }
  if (query && known.includes(query)) {
    language = query;
    try {
      localStorage.setItem(key, query);
    } catch {
      // Storage blocked: the choice still applies, it just is not remembered.
    }
    url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }
  if (language) document.documentElement.dataset.lang = language;
}

const languageScript = `(${applyLanguage.toString()})(${JSON.stringify(Object.keys(LANGUAGE_LABELS))},${JSON.stringify(LANGUAGE_STORAGE_KEY)})`;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: languageScript }} />
        <AnchorScroll />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <IceHeader />
            <main
              className={clsx('flex grow flex-col', inter.className)}
              id="main"
            >
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
