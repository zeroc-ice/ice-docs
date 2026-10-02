// Copyright (c) ZeroC, Inc.
'use client';

import { createPortal } from 'react-dom';
import { LanguageSelect } from './LanguageSelect';
import { VersionSelect, type VersionOption } from './VersionSelect';
import { Search } from './Search';
import { useMounted } from '@/context/state';

interface HeaderControlsProps {
  version: string;
  languages: string[];
  versionOptions: VersionOption[];
}

// The top bar carries the reader's whole context: which version, which language,
// and search. They are rendered here (portalled into #ice-header-controls) rather
// than in the header itself because only the page knows the equivalent URL for
// every version, and which languages the version has.
export function HeaderControls({
  version,
  languages,
  versionOptions
}: HeaderControlsProps) {
  // The portal target only exists once the header has rendered on the client.
  const mounted = useMounted();
  const target = mounted
    ? document.getElementById('ice-header-controls')
    : null;
  if (!target) return null;

  return createPortal(
    <>
      <Search version={version} />
      <VersionSelect current={version} options={versionOptions} />
      <LanguageSelect languages={languages} />
    </>,
    target
  );
}
