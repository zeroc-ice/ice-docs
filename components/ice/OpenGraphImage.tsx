// Copyright (c) ZeroC, Inc.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

import { SITE_URL } from '@/lib/site';

// The link preview card of every page: `app/**/opengraph-image.tsx` and the
// `app/og` routes are thin wrappers that name the page and hand the rest to
// these.

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The header's mark, as the card's own picture of it.
const mark = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'app/icon.svg')
).toString('base64')}`;

/** The card: the site's mark and host along the top, the title at the foot with a line naming its section under it. */
export function openGraphImage(title: string, section?: string) {
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
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 40,
          color: '#566174'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img elements. */}
          <img src={mark} width={88} height={88} alt="" />
          <span style={{ color: '#182235' }}>Ice Docs</span>
        </div>
        {new URL(SITE_URL).host}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Satori measures a word without its kerning and draws it with it,
              so a run of text comes out with uneven gaps between words. Each
              letter is a box of its own, measured and drawn alike, and the gap
              between words is fixed. */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 26,
            fontSize: 88,
            lineHeight: 1.1
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
        {section && (
          <div style={{ fontSize: 40, color: '#566174' }}>{section}</div>
        )}
      </div>
    </div>,
    size
  );
}
