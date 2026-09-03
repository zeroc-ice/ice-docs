import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

interface NavNode {
  page?: string;
  items?: NavNode[];
}

interface Nav {
  languages?: string[];
  landing?: string;
  sidebar?: NavNode[];
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
    .filter((n) => /^\d+\.\d+/.test(n) && fs.statSync(path.join(root, n)).isDirectory());
}

function readYaml<T>(file: string): T | null {
  return fs.existsSync(file) ? (yamlLoad(fs.readFileSync(file, 'utf8')) as T) : null;
}

// Mirrors landingSlug() in lib/docs-model/nav.ts: the explicit landing, else the
// first page in the table of contents. Kept in sync by hand because
// next.config.ts cannot import from the TypeScript app graph.
function firstPage(nodes: NavNode[] = []): string | undefined {
  for (const node of nodes) {
    if (node.page) return node.page;
    const nested = firstPage(node.items);
    if (nested) return nested;
  }
  return undefined;
}

function landingSlug(nav: Nav): string {
  return nav.landing ?? firstPage(nav.sidebar) ?? 'get-started';
}

// Build redirects from the content manifests: a bare /ice/<version>/<language>
// lands on the version's landing page, plus each version's redirects.yaml.
function buildRedirects(): RedirectRule[] {
  const root = path.join(process.cwd(), 'content');
  const rules: RedirectRule[] = [];

  for (const version of contentVersions(root)) {
    const nav = readYaml<Nav>(path.join(root, version, 'navigation.yaml'));
    if (!nav) continue;

    const landing = landingSlug(nav);
    for (const language of nav.languages ?? []) {
      rules.push({
        source: `/ice/${version}/${language}`,
        destination: `/ice/${version}/${language}/${landing}`,
        permanent: false
      });
    }

    const manifest = readYaml<{ redirects?: { from: string; to: string; permanent?: boolean }[] }>(
      path.join(root, version, 'redirects.yaml')
    );
    for (const r of manifest?.redirects ?? []) {
      if (r.from && r.to) {
        rules.push({ source: r.from, destination: r.to, permanent: r.permanent ?? false });
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
  }
};

export default nextConfig;
