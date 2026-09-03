// Copyright (c) ZeroC, Inc.
//
// Tag ids match the name used in markup (`{% callout %}`). A tag whose markup
// name is not a valid identifier — `{% next-steps %}` — is registered by
// markdoc/schema.ts instead.

export { default as aside } from './aside.markdoc';
export { default as callout } from './callout.markdoc';
export { default as card } from './card.markdoc';
export { default as divider } from './divider.markdoc';
export { default as grid } from './grid.markdoc';
export { default as iflang } from './iflang.markdoc';
export { default as prerequisites } from './prerequisites.markdoc';
export { default as step } from './step.markdoc';
