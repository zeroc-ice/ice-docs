// Copyright (c) ZeroC, Inc.

import fs from 'node:fs/promises';
import path from 'node:path';
import { useId } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import sharp from 'sharp';
import { prepareSvg } from '@/lib/svg-image';

/** Renders a local documentation image, inlining SVGs so they inherit the page theme. */
export async function MarkdownImage({
  src,
  alt = '',
  className
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const file = path.join(process.cwd(), 'public', src);
  if (src.endsWith('.svg')) {
    return (
      <InlineSvg
        source={await fs.readFile(file, 'utf8')}
        alt={alt}
        className={className}
      />
    );
  }
  const { width, height } = await sharp(file).metadata();
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

/** Gives each SVG occurrence its own IDs and preserves the Markdown alternative text. */
function InlineSvg({
  source,
  alt,
  className
}: {
  source: string;
  alt: string;
  className?: string;
}) {
  const prefix = `diagram-${Buffer.from(useId()).toString('hex')}`;
  const svg = prepareSvg(source, prefix);
  // These SVGs are reviewed repository assets. Their IDs and CSS must stay local
  // because several figures can share a page, including repeated occurrences.
  return (
    <svg
      {...svg.attributes}
      id={prefix}
      className={clsx('markdown-svg', className)}
      role="img"
      aria-labelledby={undefined}
      aria-label={alt || undefined}
      aria-describedby={alt ? svg.descriptionId : undefined}
      aria-hidden={alt ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: svg.content }}
    />
  );
}
