// Copyright (c) ZeroC, Inc.

import type { Metadata } from 'next';

import { buildSideNav, docsTitle, type Docs } from '@/lib/docs-model/nav';
import { SideNav } from '@/components/ice/SideNav';
import { VersionBanner } from '@/components/ice/VersionBanner';
import { readNavigation } from '@/lib/docs-model/content';

// The layout of every version: `app/<product>/<version>/layout.tsx` is a thin
// wrapper that names its version and hands the rest to these.

/** Every page of a version names it in its title: "Operations | Ice 3.8 Documentation". */
export function docsLayoutMetadata(docs: Docs): Metadata {
  return {
    title: {
      template: `%s | ${docsTitle(docs)}`,
      default: docsTitle(docs)
    }
  };
}

// What every page of a version shares: the older-release banner and the
// sidebar. A layout rather than part of each page, so the client router fetches
// the sidebar once per version rather than with every page it prefetches.
export function DocsLayout({
  docs,
  children
}: {
  docs: Docs;
  children: React.ReactNode;
}) {
  const nav = readNavigation(docs);

  return (
    <div className="flex grow flex-col">
      <VersionBanner docs={docs} />
      <div className="mt-8 flex grow flex-row justify-center">
        <div className="flex max-w-400 grow flex-row justify-center gap-6 px-6">
          {/* Sidebar: the version's table of contents. */}
          <SideNav nodes={buildSideNav(nav.sidebar, docs)} docs={docs} />

          {/* Content */}
          <div className="grow pb-8">
            <div id="skip-nav" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
