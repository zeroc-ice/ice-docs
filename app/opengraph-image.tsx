// Copyright (c) ZeroC, Inc.

import {
  contentType,
  openGraphImage,
  size
} from '@/components/ice/OpenGraphImage';
import { SITE_TITLE } from '@/lib/docs-model/nav';
import { SITE_URL } from '@/lib/site';

export const alt = SITE_TITLE;
export { contentType, size };

export default function Image() {
  return openGraphImage(new URL(SITE_URL).host, SITE_TITLE);
}
