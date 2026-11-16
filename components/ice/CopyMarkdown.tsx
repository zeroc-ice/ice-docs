// Copyright (c) ZeroC, Inc.

'use client';

import { useRef, useState } from 'react';
import { Check, CircleX, Copy, type LucideIcon } from 'lucide-react';

type CopyStatus = 'ready' | 'copied' | 'failed';

const STATUS: Record<CopyStatus, { label: string; icon: LucideIcon }> = {
  ready: { label: 'Copy as Markdown', icon: Copy },
  copied: { label: 'Copied', icon: Check },
  failed: { label: 'Copy failed', icon: CircleX }
};

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
  const [status, setStatus] = useState<CopyStatus>('ready');
  // The status of the latest click resets 3 seconds after it, not after an
  // earlier click's.
  const reset = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copyMarkdown = async () => {
    const markdown = fetch(href).then(async (response) => {
      if (!response.ok)
        throw new Error(`Markdown download failed with ${response.status}`);
      return new Blob([await response.text()], { type: 'text/plain' });
    });
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': markdown })
      ]);
      setStatus('copied');
    } catch {
      // A failed download or clipboard write is one the reader can retry.
      setStatus('failed');
    }
    clearTimeout(reset.current);
    reset.current = setTimeout(() => setStatus('ready'), 3000);
  };
  const { label, icon: Icon } = STATUS[status];
  return (
    <li data-langs={langs}>
      <button
        type="button"
        onClick={() => void copyMarkdown()}
        className="flex items-center gap-2 py-1 text-sm leading-snug text-ink-secondary focus-ring transition-colors hover:text-ink"
      >
        <Icon className="size-3.5 shrink-0" />
        <span aria-live="polite">{label}</span>
      </button>
    </li>
  );
}
