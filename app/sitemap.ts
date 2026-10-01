// Copyright (c) ZeroC, Inc.

import type { MetadataRoute } from 'next';

import {
  CONTENT_ROOT,
  listPages,
  listVersions
} from '@/lib/docs-model/content';
import { pageHref } from '@/lib/docs-model/nav';
import { SITE_URL } from '@/lib/site';

// Every page of every version, at the URL its canonical link names.
export default function sitemap(): MetadataRoute.Sitemap {
  return listVersions(CONTENT_ROOT).flatMap((version) =>
    listPages(CONTENT_ROOT, version).map((page) => ({
      url: new URL(pageHref(version, page.slug), SITE_URL).href
    }))
  );
}
