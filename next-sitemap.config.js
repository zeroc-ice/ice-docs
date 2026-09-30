import { SITE_URL } from './lib/site.ts';

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // Crawlers are let in even on a noindex build: a page robots.txt blocks is
    // never fetched, so its noindex header and meta tag would go unread.
    policies: [{ userAgent: '*', allow: '/' }]
  }
};

export default config;
