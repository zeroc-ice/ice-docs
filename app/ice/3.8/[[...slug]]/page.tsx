// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import {
  DocsPage,
  docsPageMetadata,
  docsPageParams,
  type PageProps
} from '@/components/ice/DocsPage';
import { ICE_VERSIONS } from '../../versions';
import { ICE_3_8 } from '../version';

export const dynamicParams = false;

export function generateStaticParams() {
  return docsPageParams(ICE_3_8);
}

export function generateMetadata(props: PageProps): Promise<Metadata> {
  return docsPageMetadata(ICE_3_8, props);
}

export default function Page(props: PageProps) {
  return <DocsPage version={ICE_3_8} versions={ICE_VERSIONS} {...props} />;
}
