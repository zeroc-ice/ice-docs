import { NOINDEX, SITE_URL } from './lib/site.ts';

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // A noindex build turns every crawler away; next.config.ts sends the matching
    // X-Robots-Tag header, and the root layout the matching robots meta tag.
    policies: [{ userAgent: '*', [NOINDEX ? 'disallow' : 'allow']: '/' }]
  }
};

export default config;
