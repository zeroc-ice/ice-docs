// Copyright (c) ZeroC, Inc.

'use client';

import { LinkIcon } from '@heroicons/react/24/solid';
import copy from 'copy-to-clipboard';

import { goToHeading } from '@/components/ice/AnchorScroll';
import { getLanguage } from '@/context/state';

export const HeadingCopyButton = ({ id }: { id: string }) => (
  <button
    className="h-5 pl-2 opacity-0 duration-100 ease-in-out group-hover:opacity-100"
    aria-label="Copy link to heading"
    onClick={(event) => {
      // A heading in one mapping's section is linked in that mapping, so the
      // link opens where it was copied from.
      const lang = event.currentTarget.closest('[data-langs]')
        ? `?lang=${getLanguage()}`
        : '';
      copy(`${location.origin}${location.pathname}${lang}#${id}`);
      goToHeading(id);
    }}
  >
    <LinkIcon className="size-4 font-bold text-slate-700 dark:text-slate-300" />
  </button>
);
