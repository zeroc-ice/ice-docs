// Copyright (c) ZeroC, Inc.

'use client';

import { useState } from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label="Copy to clipboard"
      // Inherits the code block's own palette, so it stays visible on the light
      // header as well as the dark one.
      className="rounded-sm px-[6px] py-1 text-(--code-header-fg) opacity-80 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
      onClick={() => {
        copy(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }}
    >
      {copied ? '🎉' : <FontAwesomeIcon icon={faCopy} className="size-4" />}
    </button>
  );
};
