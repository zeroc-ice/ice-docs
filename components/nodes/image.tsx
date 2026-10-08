// Copyright (c) ZeroC, Inc.

import path from 'node:path';
import Image from 'next/image';
import sharp from 'sharp';

// Every image names its file under `public/`, which gives the page the image's
// size to lay out around before the file arrives. The file itself is served as
// it is: none is wider than the page column, so the image optimizer would only
// re-encode it, at the cost of an encoder and a cache in the server.
export async function MarkdownImage({
  src,
  alt = '',
  className
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const { width, height } = await sharp(
    path.join(process.cwd(), 'public', src)
  ).metadata();
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
    />
  );
}
