// Copyright (c) ZeroC, Inc.

'use client';

import { useEffect } from 'react';
import Script from 'next/script';

import { setConsent, useConsent } from '@/context/consent';

// Google Analytics, loaded only once the reader accepts its cookies, and the
// banner that asks them.
export function Analytics({ measurementId }: { measurementId: string }) {
  const consent = useConsent();

  // gtag stays loaded after a reader withdraws consent; this is Google's
  // switch for stopping it from sending anything more.
  useEffect(() => {
    Object.assign(window, {
      [`ga-disable-${measurementId}`]: consent !== 'granted'
    });
  }, [measurementId, consent]);

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
          <Script id="google-analytics">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)});`}
          </Script>
        </>
      )}
      {consent === 'unset' && <ConsentBanner />}
    </>
  );
}

function ConsentBanner() {
  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-40 rounded-xl border border-hairline bg-surface p-5 text-sm text-ink shadow-2xl sm:left-auto sm:max-w-sm"
    >
      <p>
        We use Google Analytics cookies to learn how the documentation is read.
        See our{' '}
        <a
          href="https://zeroc.com/privacy"
          className="text-link hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setConsent('denied')}
          className="flex-1 rounded-lg border border-hairline-strong px-3 py-2 text-ink-secondary transition-colors hover:text-ink"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => setConsent('granted')}
          className="flex-1 rounded-lg bg-link px-3 py-2 font-medium text-surface transition-colors hover:bg-link-hover"
        >
          Accept
        </button>
      </div>
    </section>
  );
}

// Reopens the banner, so a reader can change their answer.
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => setConsent('unset')}
      className="text-ink-secondary transition-colors hover:text-ink"
    >
      Cookie Settings
    </button>
  );
}
