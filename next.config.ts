import type { NextConfig } from 'next';

import { CONTENT_ROOT, readRedirects } from './lib/docs-model/content';

const nextConfig: NextConfig = {
  output: 'standalone',
  // The floating dev badge sits on top of the bottom of the left sidebar, which
  // is exactly the region you need to see when reviewing navigation or taking
  // screenshots of it.
  devIndicators: false,
  redirects() {
    return readRedirects(CONTENT_ROOT);
  },
  // A build with SITE_NOINDEX=1 is for a host that must stay out of search
  // indexes (a dev deployment), so it must not compete with the real site.
  headers() {
    if (process.env.SITE_NOINDEX !== '1') return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
      }
    ];
  }
};

export default nextConfig;
