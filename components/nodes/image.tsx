// Copyright (c) ZeroC, Inc.

import path from 'node:path';
import Image from 'next/image';
import sharp from 'sharp';

// Every image names its file under `public/`, which gives the page the image's
// size to lay out around before the file arrives. A raster image is served by
// the image optimizer at the size and in the format the browser asks for; the
// component serves an SVG as it is.
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
    />
  );
}
