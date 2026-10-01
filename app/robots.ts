// Copyright (c) ZeroC, Inc.

import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

// Crawlers are let in even on a noindex build: a page robots.txt blocks is never
// fetched, so its noindex header and meta tag would go unread.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', SITE_URL).href
  };
}
