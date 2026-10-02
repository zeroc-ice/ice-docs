// Copyright (c) ZeroC, Inc.

import type { Version } from '@/lib/docs-model/nav';

/** The Ice versions the site serves, each from `content/<path>/` at `/<path>`. */
export const ICE_VERSIONS: Version[] = [
  {
    path: 'ice/3.8',
    title: 'Ice 3.8',
    status: 'latest',
    languages: [
      'cpp',
      'csharp',
      'java',
      'js',
      'matlab',
      'php',
      'python',
      'ruby',
      'swift'
    ]
  }
];

/** The Ice version in `directory` under `content/ice/`, which the route's `[version]` segment names. */
export function iceVersion(directory: string): Version {
  return ICE_VERSIONS.find((version) => version.path === `ice/${directory}`)!;
}
