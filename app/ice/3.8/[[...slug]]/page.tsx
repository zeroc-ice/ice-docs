// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import {
  DocsPage,
  docsPageMetadata,
  docsPageParams,
  type PageProps
} from '@/app/docs-page';
import { ICE_VERSIONS } from '../../versions';
import { VERSION } from '../version';

export const dynamicParams = false;

export function generateStaticParams() {
  return docsPageParams(VERSION);
}

export function generateMetadata(props: PageProps): Promise<Metadata> {
  return docsPageMetadata(VERSION, props);
}

export default function Page(props: PageProps) {
  return <DocsPage version={VERSION} versions={ICE_VERSIONS} {...props} />;
}
