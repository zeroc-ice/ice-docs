// SITE_NOINDEX=1 marks a build for a host that must stay out of search indexes;
// next.config.ts sends the matching X-Robots-Tag header.
const noindex = process.env.SITE_NOINDEX === '1';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://docs.zeroc.com/ice',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', [noindex ? 'disallow' : 'allow']: '/' }]
  }
};
