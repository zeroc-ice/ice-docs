// Copyright (c) ZeroC, Inc.

/** Prepares a repository-owned SVG for one inline occurrence in a page. */
export function prepareSvg(source: string, prefix: string) {
  const ids = new Map(
    [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => [
      match[1],
      `${prefix}-${match[1]}`
    ])
  );
  const localId = (id: string) => ids.get(id) ?? id;
  const svg = source
    .replace(/\sid="([^"]+)"/g, (_, id: string) => ` id="${localId(id)}"`)
    .replace(
      /url\((["']?)#([^\s)"']+)\1\)/g,
      (_, quote: string, id: string) => `url(${quote}#${localId(id)}${quote})`
    )
    .replace(
      /(\s(?:xlink:)?href)="#([^"]+)"/g,
      (_, name: string, id: string) => `${name}="#${localId(id)}"`
    )
    .replace(
      /(\saria-(?:labelledby|describedby))="([^"]+)"/g,
      (_, name: string, value: string) =>
        `${name}="${value.split(/\s+/).map(localId).join(' ')}"`
    )
    .replace(/<style>([\s\S]*?)<\/style>/g, (_, css: string) => {
      const scoped = css.replace(
        /([^{}]+)\{([^}]*)\}/g,
        (_, selectors: string, body: string) => {
          const local = selectors.split(',').map((selector) => {
            const scopedIds = selector
              .trim()
              .replace(/#([\w-]+)/g, (_, id: string) => `#${localId(id)}`);
            return `#${prefix} ${scopedIds}`;
          });
          return `${local.join(',\n')} {${body}}`;
        }
      );
      return `<style>${scoped}</style>`;
    });
  const root = /<svg\b([^>]*)>([\s\S]*)<\/svg>/.exec(svg);
  if (!root) throw new Error('Expected a complete SVG document');
  return {
    attributes: Object.fromEntries(
      [...root[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
        match[1],
        match[2]
      ])
    ),
    content: root[2],
    descriptionId: /<desc\b[^>]*\sid="([^"]+)"/.exec(root[2])?.[1]
  };
}
