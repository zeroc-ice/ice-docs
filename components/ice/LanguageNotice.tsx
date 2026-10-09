// Copyright (c) ZeroC, Inc.
'use client';

import { languageLabel } from '@/lib/docs-model/nav';
import { switchLanguage } from './switch-language';

// Read by someone whose language a page is not written for: it names the
// languages that have the page, and each name switches to it.
export function LanguageNotice({ writtenFor }: { writtenFor: string[] }) {
  return (
    <p>
      This page is written for{' '}
      {new Intl.ListFormat('en').formatToParts(writtenFor).map((part, i) =>
        part.type === 'element' ? (
          <button
            key={i}
            type="button"
            onClick={() => switchLanguage(part.value)}
            className="font-semibold text-link hover:underline"
          >
            {languageLabel(part.value)}
          </button>
        ) : (
          part.value
        )
      )}
      .
    </p>
  );
}
