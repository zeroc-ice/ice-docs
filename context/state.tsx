// Copyright (c) ZeroC, Inc.

'use client';

import { useSyncExternalStore } from 'react';

import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@/lib/docs-model/nav';

// Whether the component has mounted on the client. False during server rendering
// and hydration, so anything read from browser storage is read only once the
// server and the first client render agree.
export const useMounted = () => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
};

// The reader's language mapping. Every page carries every mapping; which one
// shows is `data-lang` on <html>, set before the first paint by the script in
// the root layout from local storage, and by the switches after that. The
// attribute is the one source of truth, so the stylesheet, the store, and the
// script all agree.
const listeners = new Set<() => void>();

export const getLanguage = () => document.documentElement.dataset.lang!;

export function setLanguage(language: string) {
  document.documentElement.dataset.lang = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage blocked: the choice still applies, it just is not remembered.
  }
  for (const listener of listeners) listener();
}

export const useLanguage = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getLanguage,
    () => DEFAULT_LANGUAGE
  );
