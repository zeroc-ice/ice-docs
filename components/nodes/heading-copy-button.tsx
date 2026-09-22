// Copyright (c) ZeroC, Inc.

'use client';

import { LinkIcon } from '@heroicons/react/24/solid';
import copy from 'copy-to-clipboard';

import { scrollToId } from '@/components/ice/AnchorScroll';

export const HeadingCopyButton = ({ id }: { id: string }) => (
  <button
    className="h-5 pl-2 opacity-0 duration-100 ease-in-out group-hover:opacity-100"
    aria-label="Copy link to heading"
    onClick={() => {
      copy(window.location.origin + window.location.pathname + `#${id}`);
      window.history.pushState(null, '', `#${id}`);
      scrollToId(id);
    }}
  >
    <LinkIcon className="size-4 font-bold text-slate-700 dark:text-slate-300" />
  </button>
);
