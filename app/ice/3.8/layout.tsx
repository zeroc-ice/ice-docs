// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import { DocsLayout, docsLayoutMetadata } from '@/app/docs-layout';
import { VERSION } from './version';

export const metadata: Metadata = docsLayoutMetadata(VERSION);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout version={VERSION}>{children}</DocsLayout>;
}
