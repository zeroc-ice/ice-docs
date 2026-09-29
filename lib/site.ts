// Copyright (c) ZeroC, Inc.

/** The origin the site's absolute URLs start with: `SITE_URL`, set per deployment, or docs.zeroc.com. */
export const SITE_URL = process.env.SITE_URL || 'https://docs.zeroc.com';

/** Whether the build is for a host that must stay out of search indexes, such as a dev deployment: `SITE_NOINDEX=1`. */
export const NOINDEX = process.env.SITE_NOINDEX === '1';
