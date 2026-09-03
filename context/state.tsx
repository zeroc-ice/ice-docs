// Copyright (c) ZeroC, Inc.

'use client';

import { useSyncExternalStore } from 'react';

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
