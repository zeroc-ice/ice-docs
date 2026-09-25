// Copyright (c) ZeroC, Inc.

// A reader who lands on an older release from a search engine must be told so
// before they read a line of it — silently serving stale documentation is the
// most expensive failure a versioned manual can have.
export function VersionBanner({
  version,
  status
}: {
  version: string;
  status?: string;
}) {
  if (!status || status === 'latest') return null;

  return (
    <div className="border-b border-amber-300/60 bg-amber-50 px-6 py-2.5 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="mx-auto max-w-400">
        You are reading the documentation for Ice {version}
        {status === 'archived' ? ', which is no longer supported' : ''}.
      </div>
    </div>
  );
}
