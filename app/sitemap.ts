// Copyright (c) ZeroC, Inc.

import type { MetadataRoute } from 'next';

import { ICE_DOCS } from '@/app/ice/docs';
import { listPages } from '@/lib/docs-model/content';
import { pageHref } from '@/lib/docs-model/nav';
import { SITE_URL } from '@/lib/site';

// Every page of every version, at the URL its canonical link names.
export default function sitemap(): MetadataRoute.Sitemap {
  return ICE_DOCS.flatMap((docs) =>
    listPages(docs).map((page) => ({
      url: new URL(pageHref(docs, page.slug), SITE_URL).href
    }))
  );
}
