// Copyright (c) ZeroC, Inc.

import type { PageProps } from '@/components/ice/DocsPage';
import { pageMarkdown, pageMarkdownParams } from '@/lib/page-markdown';
import { ICE_3_8 } from '@/app/ice/3.8/version';

// Every page of the version as Markdown. next.config.ts serves it at the page's
// path with `.md` appended, and sends a request at this route's own path there.

export const dynamicParams = false;

export function generateStaticParams() {
  return pageMarkdownParams(ICE_3_8);
}

export function GET(_request: Request, props: PageProps) {
  return pageMarkdown(ICE_3_8, props);
}
