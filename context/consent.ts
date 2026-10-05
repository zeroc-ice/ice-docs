// Copyright (c) ZeroC, Inc.

'use client';

import { useSyncExternalStore } from 'react';

// The reader's answer to the analytics cookie banner, kept in local storage.
// `unset` means they have not answered, or chose to answer again.
export type Consent = 'granted' | 'denied' | 'unset';

const CONSENT_STORAGE_KEY = 'analytics-consent';

const listeners = new Set<() => void>();

// Read from storage once, then kept here, so a choice still holds for the rest
// of the visit when storage is blocked.
let consent: Consent | undefined;

function readConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') return stored;
  } catch {
    // Storage blocked: the reader is asked on each visit.
  }
  return 'unset';
}

const getConsent = () => (consent ??= readConsent());

export function setConsent(value: Consent) {
  consent = value;
  try {
    if (value === 'unset') {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    }
  } catch {
    // Storage blocked: the choice still applies, it just is not remembered.
  }
  for (const listener of listeners) listener();
}

// Server rendering and hydration see `denied`, so neither draws the banner nor
// loads analytics before the stored answer is known.
export const useConsent = () =>
  useSyncExternalStore<Consent>(
    (listener) => {
      // A choice made in another tab arrives as a storage event.
      const onStorage = (event: StorageEvent) => {
        if (event.key !== CONSENT_STORAGE_KEY) return;
        consent = undefined;
        listener();
      };
      listeners.add(listener);
      window.addEventListener('storage', onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
      };
    },
    getConsent,
    () => 'denied'
  );
