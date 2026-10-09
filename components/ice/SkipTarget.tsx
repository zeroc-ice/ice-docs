// Copyright (c) ZeroC, Inc.

// Where the header's "Skip to content" link lands: each page template puts it
// where its content starts. Focusable, so the Tab key carries on from there,
// and clear of the sticky header when the link scrolls to it.
export function SkipTarget() {
  return <div id="skip-nav" tabIndex={-1} className="scroll-mt-28" />;
}
