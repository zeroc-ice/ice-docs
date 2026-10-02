// Copyright (c) ZeroC, Inc.
'use client';

import { createPortal } from 'react-dom';
import { LanguageSelect } from './LanguageSelect';
import { VersionSelect, type VersionOption } from './VersionSelect';
import { Search } from './Search';
import { useMounted } from '@/context/state';
import type { Docs } from '@/lib/docs-model/nav';

interface HeaderControlsProps {
  docs: Docs;
  versionOptions: VersionOption[];
}

// The top bar carries the reader's whole context: which version, which language,
// and search. They are rendered here (portalled into #ice-header-controls) rather
// than in the header itself because only the page knows the equivalent URL for
// every version, and which languages the version has.
export function HeaderControls({ docs, versionOptions }: HeaderControlsProps) {
  // The portal target only exists once the header has rendered on the client.
  const mounted = useMounted();
  const target = mounted
    ? document.getElementById('ice-header-controls')
    : null;
  if (!target) return null;

  return createPortal(
    <>
      <Search docs={docs} />
      <VersionSelect current={docs} options={versionOptions} />
      <LanguageSelect languages={docs.languages} />
    </>,
    target
  );
}
