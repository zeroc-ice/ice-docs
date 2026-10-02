// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import {
  DocsPage,
  docsPageMetadata,
  docsPageParams,
  type PageProps
} from '@/app/docs-page';
import { ICE_DOCS } from '../../docs';
import { ICE_3_8 } from '../docs';

export const dynamicParams = false;

export function generateStaticParams() {
  return docsPageParams(ICE_3_8);
}

export function generateMetadata(props: PageProps): Promise<Metadata> {
  return docsPageMetadata(ICE_3_8, props);
}

export default function Page(props: PageProps) {
  return <DocsPage docs={ICE_3_8} versions={ICE_DOCS} {...props} />;
}
