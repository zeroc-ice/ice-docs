// Copyright (c) ZeroC, Inc.

import type { DocsVersion } from '@/lib/docs-model/nav';
// Named with its extension so the scripts can import this module under plain Node.
import { ICE_3_8 } from './3.8/version.ts';

/** The Ice documentation the site serves, one per release, each with its route under `app/ice/<version>/`. */
export const ICE_VERSIONS: DocsVersion[] = [ICE_3_8];
