// Copyright (c) ZeroC, Inc.

'use client';

import dynamic from 'next/dynamic';

// Mermaid draws in the browser only. A server component cannot skip server
// rendering, so the code block loads the diagram through this client module.
export const MermaidDiagram = dynamic(
  () => import('@/components/tags/mermaid'),
  { ssr: false }
);
