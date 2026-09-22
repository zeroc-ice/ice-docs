// Copyright (c) ZeroC, Inc.

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AnchorScroll } from '@/components/ice/AnchorScroll';
import { IceHeader } from '@/components/ice/Header';
import { Footer } from '@/components/ice/Footer';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
  LANGUAGE_STORAGE_KEY
} from '@/lib/docs-model/nav';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: {
    default: 'Ice Manual',
    template: '%s | Ice Manual'
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
    index: true,
    follow: true
  }
};

// Applies the reader's language mapping before the first paint, so the page
// never shows one mapping and then switches to theirs: a `?lang=` in the URL,
// which a link can carry, else the stored choice. The query is stored as the
// choice and dropped from the address, so the URL a reader copies stays clean.
// The attribute it sets is what the stylesheet keys on; see context/state.tsx.
const languageScript = `(function(){
var known=${JSON.stringify(Object.keys(LANGUAGE_LABELS))},key=${JSON.stringify(LANGUAGE_STORAGE_KEY)};
var url=new URL(location.href),q=url.searchParams.get('lang'),l=null;
try{l=localStorage.getItem(key)}catch(e){}
if(known.includes(q)){l=q;try{localStorage.setItem(key,q)}catch(e){}url.searchParams.delete('lang');history.replaceState(null,'',url)}
if(known.includes(l))document.documentElement.dataset.lang=l
})()`;

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
