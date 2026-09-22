// Copyright (c) ZeroC, Inc.
'use client';

import { Fragment } from 'react';

import { setLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

// Read by someone whose language a page is not written for: it names the
// languages that have the page, and each name switches to it.
export function LanguageNotice({ writtenFor }: { writtenFor: string[] }) {
  const last = writtenFor.length - 1;
  const separator = (i: number) =>
    i === 0 ? '' : i < last ? ', ' : last > 1 ? ', and ' : ' and ';
  return (
    <p>
      This page is written for{' '}
      {writtenFor.map((language, i) => (
        <Fragment key={language}>
          {separator(i)}
          <button
            type="button"
            onClick={() => setLanguage(language)}
            className="text-link font-semibold hover:underline"
          >
            {languageLabel(language)}
          </button>
        </Fragment>
      ))}
      .
    </p>
  );
}
