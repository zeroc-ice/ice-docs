// Copyright (c) ZeroC, Inc.

import type { Version } from '@/lib/docs-model/nav';
import { ICE_VERSIONS } from './ice/versions.ts';

/** Every version the site serves, product by product. */
export const VERSIONS: Version[] = [...ICE_VERSIONS];
