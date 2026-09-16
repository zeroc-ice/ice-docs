// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

// Fence info strings a sample may use, mapped to the manual's language slugs.
const MAPPING_OF_FENCE: Record<string, string> = {
  cs: 'csharp',
  javascript: 'js',
  py: 'python',
  rb: 'ruby',
  ts: 'js',
  typescript: 'js'
};

interface Fence {
  language: string;
  title?: string;
  code: string;
}

// The front page's hero: one Slice contract, and the client and server that
// use it in each language mapping. The first fence is the contract; every
// other fence is a sample, keyed by its language, and a sample titled
// `Server.*` is that mapping's server. The manual's language list
// ($languages) orders the mappings and marks the current one.
const showcase: Schema = {
  render: 'Showcase',
  children: ['fence'],
  transform(node: Node, config: Config) {
    const variables = config.variables ?? {};
    const fences: (Fence & { mapping: string })[] = node.children
      .filter((child) => child.type === 'fence')
      .map((fence) => {
        const language = String(fence.attributes.language ?? '');
        return {
          language,
          mapping: MAPPING_OF_FENCE[language] ?? language,
          title: fence.attributes.title as string | undefined,
          code: String(fence.attributes.content ?? '')
        };
      });
    const [contract, ...rest] = fences;

    const samples = new Map<string, { client?: Fence; server?: Fence }>();
    for (const { mapping, ...fence } of rest) {
      const sample = samples.get(mapping) ?? {};
      sample[/^server/i.test(fence.title ?? '') ? 'server' : 'client'] = fence;
      samples.set(mapping, sample);
    }

    return new Tag('Showcase', {
      version: String(variables.version ?? ''),
      current: String(variables.language ?? ''),
      path: String(variables.path ?? ''),
      languages: (variables.languages ?? []) as string[],
      contract,
      samples: [...samples].map(([mapping, sample]) => ({ mapping, ...sample }))
    });
  }
};

export default showcase;
