// Copyright (c) ZeroC, Inc.

import { ICE_VERSIONS } from '@/app/ice/versions';
import { llmsTxt } from '@/lib/page-markdown';

// The index of the Markdown copies of the pages (see lib/page-markdown.ts).

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(ICE_VERSIONS), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
}
