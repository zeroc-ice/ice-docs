import type { NextConfig } from 'next';

import { ICE_VERSIONS } from './app/ice/versions';
import { readRedirects } from './lib/docs-model/content';
import { NOINDEX } from './lib/site';

const nextConfig: NextConfig = {
  output: 'standalone',
  // The floating dev badge sits on top of the bottom of the left sidebar, which
  // is exactly the region you need to see when reviewing navigation or taking
  // screenshots of it.
  devIndicators: false,
  redirects() {
    return [
      ...readRedirects(ICE_VERSIONS),
      // A Markdown copy has one URL, the page's with `.md` appended; a request
      // at the route's own path under /md goes there.
      ...ICE_VERSIONS.map((version) => ({
        source: `/md/${version.path}/:slug*`,
        destination: `/${version.path}/:slug*.md`,
        permanent: true
      }))
    ];
  },
  // The Markdown copy of a page is at its URL with `.md` appended, and comes
  // from the route under app/md (see lib/page-markdown.ts).
  rewrites() {
    return ICE_VERSIONS.map((version) => ({
      source: `/${version.path}/:slug*.md`,
      destination: `/md/${version.path}/:slug*`
    }));
  },
  // A build for a host that must stay out of search indexes (a dev deployment)
  // must not compete with the real site. The header also covers the files a
  // robots meta tag can't, such as images and the search index.
  headers() {
    if (!NOINDEX) return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
      }
    ];
  }
};

export default nextConfig;
