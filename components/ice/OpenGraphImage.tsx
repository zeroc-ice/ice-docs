// Copyright (c) ZeroC, Inc.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// The link preview card of every page: `app/**/opengraph-image.tsx` and the
// `app/og` routes are thin wrappers that name the page and hand the rest to
// these.

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The header's mark, as the card's own picture of it.
const mark = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'app/icon.svg')
).toString('base64')}`;

/** The card: the mark and a line naming the site or version, over the title. */
export function openGraphImage(eyebrow: string, title: string) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#ffffff',
        color: '#182235'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          fontSize: 38,
          color: '#566174'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img elements. */}
        <img src={mark} width={80} height={80} alt="" />
        {eyebrow}
      </div>
      {/* Satori measures a word without its kerning and draws it with it,
            so a run of text comes out with uneven gaps between words. Each
            letter is a box of its own, measured and drawn alike, and the gap
            between words is fixed. */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 22,
          fontSize: 76,
          lineHeight: 1.15
        }}
      >
        {title.split(' ').map((word, i) => (
          <span key={i} style={{ display: 'flex' }}>
            {[...word].map((letter, j) => (
              <span key={j}>{letter}</span>
            ))}
          </span>
        ))}
      </div>
    </div>,
    size
  );
}
