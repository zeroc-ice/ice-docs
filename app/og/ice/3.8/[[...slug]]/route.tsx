// Copyright (c) ZeroC, Inc.

import {
  docsPageParams,
  docsPageTitle,
  type PageProps
} from '@/components/ice/DocsPage';
import { openGraphImage } from '@/components/ice/OpenGraphImage';
import { versionTitle } from '@/lib/docs-model/nav';
import { ICE_3_8 } from '@/app/ice/3.8/version';

// The link preview card of every page of the version, at /og + the page's
// path: a metadata image cannot live under the page's catch-all route.

export const dynamicParams = false;

export function generateStaticParams() {
  return docsPageParams(ICE_3_8);
}

export async function GET(_request: Request, props: PageProps) {
  return openGraphImage(
    await docsPageTitle(ICE_3_8, props),
    versionTitle(ICE_3_8)
  );
}
