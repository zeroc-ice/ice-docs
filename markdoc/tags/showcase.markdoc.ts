// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

interface Fence {
  language: string;
  title?: string;
  code: string;
}

// The front page's hero: one Slice contract, and the client and server that
// use it in each language mapping. The first fence is the contract; every
// other fence is a sample whose language is the mapping's slug, and a sample
// titled `Server.*` is that mapping's server. The manual's language list, from
// the chrome the route provides, orders the mappings and marks the current one.
const showcase: Schema = {
  render: 'Showcase',
  children: ['fence'],
  transform(node: Node, config: Config) {
    const variables = config.variables ?? {};
    const [contract, ...rest]: Fence[] = node.children
      .filter((child) => child.type === 'fence')
      .map((fence) => ({
        language: String(fence.attributes.language ?? ''),
        title: fence.attributes.title as string | undefined,
        code: String(fence.attributes.content ?? '')
      }));

    const samples = new Map<string, { client?: Fence; server?: Fence }>();
    for (const fence of rest) {
      const sample = samples.get(fence.language) ?? {};
      sample[/^server/i.test(fence.title ?? '') ? 'server' : 'client'] = fence;
      samples.set(fence.language, sample);
    }

    return new Tag('Showcase', {
      version: String(variables.version ?? ''),
      current: String(variables.language ?? ''),
      path: String(variables.path ?? ''),
      languages: (variables.chrome?.languages ?? []) as string[],
      contract,
      samples: [...samples].map(([mapping, sample]) => ({ mapping, ...sample }))
    });
  }
};

export default showcase;
