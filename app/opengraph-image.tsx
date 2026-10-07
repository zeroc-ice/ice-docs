// Copyright (c) ZeroC, Inc.

import {
  contentType,
  openGraphImage,
  size
} from '@/components/ice/OpenGraphImage';
import { SITE_TITLE } from '@/lib/docs-model/nav';

export const alt = SITE_TITLE;
export { contentType, size };

export default function Image() {
  return openGraphImage(SITE_TITLE);
}
