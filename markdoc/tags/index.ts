// Copyright (c) ZeroC, Inc.
//
// Tag ids match the name used in markup (`{% callout %}`). A tag whose markup
// name is not a valid identifier — `{% next-steps %}` — is registered by
// markdoc/schema.ts instead.

export { default as aside } from './aside.markdoc.ts';
export { default as callout } from './callout.markdoc.ts';
export { default as card } from './card.markdoc.ts';
export { default as divider } from './divider.markdoc.ts';
export { default as grid } from './grid.markdoc.ts';
export { default as iflang } from './iflang.markdoc.ts';
export { default as prerequisites } from './prerequisites.markdoc.ts';
export { default as releases } from './releases.markdoc.ts';
export { default as selection } from './selection.markdoc.ts';
export { default as showcase } from './showcase.markdoc.ts';
export { default as step } from './step.markdoc.ts';
