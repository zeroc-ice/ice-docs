// Copyright (c) ZeroC, Inc.

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { IceHeader } from '@/components/ice/Header';
import { Footer } from '@/components/ice/Footer';
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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
