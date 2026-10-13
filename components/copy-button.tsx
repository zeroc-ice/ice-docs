// Copyright (c) ZeroC, Inc.

'use client';

import { useState } from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copyText = async () => {
    if (await copy(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };
  return (
    <button
      aria-label="Copy to clipboard"
      // Inherits the code block's own palette, so it stays visible on the light
      // header as well as the dark one. A flex box, so it is the size of its
      // icon rather than of a line of the article's text.
      className="flex rounded-sm px-[6px] py-1 text-(--code-header-fg) opacity-80 focus-ring hover:bg-black/5 hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-white/10"
      onClick={() => void copyText()}
    >
      {copied ? '🎉' : <FontAwesomeIcon icon={faCopy} className="size-4" />}
    </button>
  );
};
