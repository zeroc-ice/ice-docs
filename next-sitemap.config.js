import { SITE_URL } from './lib/site.ts';

// SITE_NOINDEX=1 marks a build for a host that must stay out of search indexes;
// next.config.ts sends the matching X-Robots-Tag header.
const noindex = process.env.SITE_NOINDEX === '1';

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', [noindex ? 'disallow' : 'allow']: '/' }]
  }
};

export default config;
