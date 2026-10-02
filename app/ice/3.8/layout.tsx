// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import { DocsLayout, docsLayoutMetadata } from '@/app/docs-layout';
import { ICE_3_8 } from './docs';

export const metadata: Metadata = docsLayoutMetadata(ICE_3_8);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout docs={ICE_3_8}>{children}</DocsLayout>;
}
