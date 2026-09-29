// Copyright (c) ZeroC, Inc.

import { buildSideNav } from '@/lib/docs-model/nav';
import { SideNav } from '@/components/ice/SideNav';
import { VersionBanner } from '@/components/ice/VersionBanner';
import { CONTENT_ROOT, readNavigation } from '@/lib/docs-model/content';

// What every page of a version shares: the older-release banner and the
// sidebar. A layout rather than part of each page, so the client router fetches
// the sidebar once per version rather than with every page it prefetches.
export default async function VersionLayout({
  params,
  children
}: {
  params: Promise<{ version: string }>;
  children: React.ReactNode;
}) {
  const { version } = await params;
  const nav = readNavigation(CONTENT_ROOT, version);

  return (
    <div className="flex grow flex-col">
      <VersionBanner version={version} status={nav.status} />
      <div className="mt-8 flex grow flex-row justify-center">
        <div className="flex max-w-400 grow flex-row justify-center gap-6 px-6">
          {/* Sidebar: the manual's table of contents. */}
          <SideNav nodes={buildSideNav(nav.sidebar, version)} />

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
