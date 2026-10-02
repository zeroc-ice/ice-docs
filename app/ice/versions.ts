// Copyright (c) ZeroC, Inc.

import type { Version } from '@/lib/docs-model/nav';
import { VERSION as ICE_3_8 } from './3.8/version.ts';

/** The Ice versions the site serves, each with its route under `app/ice/<version>/`. */
export const ICE_VERSIONS: Version[] = [ICE_3_8];
