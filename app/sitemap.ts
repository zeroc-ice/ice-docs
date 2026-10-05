// Copyright (c) ZeroC, Inc.

import type { MetadataRoute } from 'next';

import { ICE_VERSIONS } from '@/app/ice/versions';
import { listPages } from '@/lib/docs-model/content';
import { pageHref } from '@/lib/docs-model/nav';
import { SITE_URL } from '@/lib/site';

// Every page of every version, at the URL its canonical link names.
export default function sitemap(): MetadataRoute.Sitemap {
  return ICE_VERSIONS.flatMap((version) =>
    listPages(version).map((page) => ({
      url: new URL(pageHref(version, page.slug), SITE_URL).href
    }))
  );
}
