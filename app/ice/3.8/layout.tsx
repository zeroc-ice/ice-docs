// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import { DocsLayout, docsLayoutMetadata } from '@/components/ice/DocsLayout';
import { ICE_3_8 } from './version';

export const metadata: Metadata = docsLayoutMetadata(ICE_3_8);

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout version={ICE_3_8}>{children}</DocsLayout>;
}
