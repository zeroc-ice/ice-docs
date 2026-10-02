// Copyright (c) ZeroC, Inc.

import type { MetadataRoute } from 'next';

import { VERSIONS } from '@/app/versions';
import { listPages } from '@/lib/docs-model/content';
import { pageHref } from '@/lib/docs-model/nav';
import { SITE_URL } from '@/lib/site';

// Every page of every version, at the URL its canonical link names.
export default function sitemap(): MetadataRoute.Sitemap {
  return VERSIONS.flatMap((version) =>
    listPages(version).map((page) => ({
      url: new URL(pageHref(version, page.slug), SITE_URL).href
    }))
  );
}
