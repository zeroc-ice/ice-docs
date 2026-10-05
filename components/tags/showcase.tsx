// Copyright (c) ZeroC, Inc.

import { CodeBlock } from '@/components/code-block';
import { FileTabs, LanguageTabs } from './showcase-tabs';

interface Fence {
  /** The fence's info string, which is also the highlighter's grammar. */
  language: string;
  title?: string;
  code: string;
}

interface Panel {
  /** The mapping this panel holds for. */
  lang: string;
  contract: Fence;
  client: Fence;
  server?: Fence;
}

interface Props {
  /** One per mapping, in the version's language order. */
  panels: Panel[];
}

// The Slice contract beside the client that calls it and, where the mapping
// has one, the server that implements it. The language tabs are the site's
// language switch, so the top bar follows.
export const Showcase = ({ panels }: Props) => {
  const languages = panels.map((panel) => panel.lang);

  return (
    <section
      aria-label="Ice in every language"
      className="doc-wide not-prose my-8 overflow-hidden rounded-lg border border-hairline bg-surface-sunken text-ink [&_.code-block]:my-0 [&_code>div]:text-[11px] sm:[&_code>div]:text-xs [&_pre]:overflow-x-auto"
    >
      <LanguageTabs languages={languages} />

      {panels.map((panel) => (
        <div key={panel.lang} data-langs={panel.lang}>
          <Code {...panel} />
        </div>
      ))}
    </section>
  );
};

const Code = ({ contract, client, server }: Panel) => {
  return (
    <div className="grid gap-3 p-3 sm:p-4 xl:grid-cols-2 [&>*]:min-w-0 [&>.code-block]:h-full">
      <CodeBlock data-language={contract.language} title={contract.title}>
        {contract.code}
      </CodeBlock>
      {server ? (
        <FileTabs
          files={[client, server].map((fence) => ({
            title: fence.title,
            block: (
              <CodeBlock data-language={fence.language} showTitle={false}>
                {fence.code}
              </CodeBlock>
            )
          }))}
        />
      ) : (
        <CodeBlock data-language={client.language} title={client.title}>
          {client.code}
        </CodeBlock>
      )}
    </div>
  );
};
