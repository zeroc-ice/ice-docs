// Copyright (c) ZeroC, Inc.

'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Puts the page's Markdown on the clipboard, for pasting into a chat with an AI
// assistant. The clipboard item takes the download's promise rather than its
// text, because Safari allows a clipboard write only within the click's
// handler, and awaiting the download would end it.
export function CopyMarkdown({
  href,
  langs
}: {
  href: string;
  langs?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyMarkdown = async () => {
    const markdown = fetch(href).then(
      async (response) =>
        new Blob([await response.text()], { type: 'text/plain' })
    );
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/plain': markdown })
    ]);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  const Icon = copied ? Check : Copy;
  return (
    <li data-langs={langs}>
      <button
        type="button"
        onClick={() => void copyMarkdown()}
        className="flex items-center gap-2 py-1 text-sm leading-snug text-ink-secondary focus-ring transition-colors hover:text-ink"
      >
        <Icon className="size-3.5 shrink-0" />
        <span aria-live="polite">{copied ? 'Copied' : 'Copy as Markdown'}</span>
      </button>
    </li>
  );
}
