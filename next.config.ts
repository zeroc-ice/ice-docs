import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

interface Nav {
  languages?: string[];
}

interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

function contentVersions(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter(
      (n) =>
        /^\d+\.\d+/.test(n) && fs.statSync(path.join(root, n)).isDirectory()
    );
}

function readYaml<T>(file: string): T | null {
  return fs.existsSync(file)
    ? (yamlLoad(fs.readFileSync(file, 'utf8')) as T)
    : null;
}

// Build redirects from the content manifests: the site root, a bare /ice, and a
// bare /ice/<version> land on a version's front page, which is served at
// /ice/<version>/<language> (the newest version's, in its first language, when
// they name no version), plus each version's redirects.yaml.
function buildRedirects(): RedirectRule[] {
  const root = path.join(process.cwd(), 'content', 'ice');
  const rules: RedirectRule[] = [];
  const versions = contentVersions(root).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  for (const version of versions) {
    const nav = readYaml<Nav>(path.join(root, version, 'navigation.yaml'));
    if (!nav) continue;

    const language = nav.languages?.[0];
    if (language) {
      const destination = `/ice/${version}/${language}`;
      rules.push({ source: `/ice/${version}`, destination, permanent: false });
      if (version === versions[versions.length - 1]) {
        rules.push({ source: '/', destination, permanent: false });
        rules.push({ source: '/ice', destination, permanent: false });
      }
    }

    const manifest = readYaml<{
      redirects?: { from: string; to: string; permanent?: boolean }[];
    }>(path.join(root, version, 'redirects.yaml'));
    for (const r of manifest?.redirects ?? []) {
      if (r.from && r.to) {
        rules.push({
          source: r.from,
          destination: r.to,
          permanent: r.permanent ?? false
        });
      }
    }
  }

  return rules;
}

const nextConfig: NextConfig = {
  output: 'standalone',
  // The floating dev badge sits on top of the bottom of the left sidebar, which
  // is exactly the region you need to see when reviewing navigation or taking
  // screenshots of it.
  devIndicators: false,
  async redirects() {
    return buildRedirects();
  },
  // A build with SITE_NOINDEX=1 is for a host that must stay out of search
  // indexes (a dev deployment), so it must not compete with the real site.
  async headers() {
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
