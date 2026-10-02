// Copyright (c) ZeroC, Inc.

import { faFileLines, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Fira_Mono } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import { languageLabel } from '@/lib/docs-model/nav';
import { highlight } from '@/utils/highlight';
import { CopyButton } from './copy-button';
import { MermaidDiagram } from './mermaid-diagram';

const firaMono = Fira_Mono({ weight: '400', subsets: ['latin', 'latin-ext'] });

// Info strings the docs use that are not Prism language ids.
const LANGUAGE_ALIASES: Record<string, string> = {
  proto: 'protobuf',
  // Ice configuration files: `Ice.Default.Locator=…` with `#` comments.
  config: 'properties',
  cfg: 'properties',
  ini: 'properties',
  text: '',
  txt: ''
};

// Display names for the languages the docs use besides the mappings, which
// `languageLabel` names.
const LANGUAGE_NAMES: Record<string, string> = {
  diff: 'Diff',
  groovy: 'Groovy',
  kotlin: 'Kotlin',
  powershell: 'PowerShell',
  properties: 'Properties',
  py: 'Python',
  shell: 'Shell',
  slice: 'Slice',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  xml: 'XML',
  yaml: 'YAML'
};

const commandLineLanguages = [
  'bash',
  'sh',
  'zsh',
  'powershell',
  'cmd',
  'batch',
  'dos',
  'shell'
];

type Props = {
  children: string;
  'data-language'?: string;
  title?: string;
  showTitle?: boolean;
};

export const CodeBlock = ({
  children,
  'data-language': language,
  title,
  showTitle = true
}: Props) => {
  const alias = LANGUAGE_ALIASES[language?.toLowerCase() ?? ''];
  if (alias !== undefined) {
    language = alias || undefined;
  }

  // If the language is mermaid, render the mermaid diagram
  if (language?.toLowerCase() === 'mermaid') {
    return (
      <div className="doc-wide mx-auto my-4 w-full">
        <MermaidDiagram value={`${children.trim()}`} />
      </div>
    );
  }

  return (
    <div className="code-block doc-wide group relative my-4 w-full items-center overflow-hidden rounded-lg border border-(--code-border) bg-(--code-bg)">
      <TopBar
        language={language}
        code={children}
        title={title}
        hideTitle={!showTitle}
      />
      <pre
        className={clsx(
          firaMono.className,
          'my-2 bg-(--code-bg) pl-2.5 text-(--code-plain)'
        )}
      >
        {/* The lines take the text colour themselves: outside the article's
            typography, the global `code` rule would give them its own. */}
        <code
          className="[&>div]:max-w-0 [&>div]:py-[3px] [&>div]:pr-5 [&>div]:text-xs [&>div]:text-(--code-plain)"
          dangerouslySetInnerHTML={{
            __html: highlight(children.trim(), language?.toLowerCase() ?? '')
          }}
        />
      </pre>
      {!showTitle && (
        <div
          className={clsx(
            'absolute top-2 right-0 mr-4 rounded-sm border border-(--code-border) bg-(--code-bg) opacity-0',
            'transition-opacity duration-500 group-hover:opacity-100'
          )}
        >
          <CopyButton text={children} />
        </div>
      )}
    </div>
  );
};

type TopBarProps = {
  language?: string;
  title?: string;
  code: string;
  hideTitle?: boolean;
};

const TopBar = ({ language, code, title, hideTitle }: TopBarProps) =>
  language && !hideTitle ? (
    <div className="flex h-11 flex-row items-center justify-between border-b border-(--code-border) bg-(--code-header-bg) text-(--code-header-fg)">
      <div className="m-0 ml-4 flex flex-row items-center gap-3 p-0 text-sm">
        {LanguageIcon(language)}
        {title ?? LANGUAGE_NAMES[language] ?? languageLabel(language)}
      </div>
      <div className="mr-4 flex flex-row items-center gap-4">
        <CopyButton text={code} />
      </div>
    </div>
  ) : null;

// Provides an icon given the language of the code block
function LanguageIcon(language: string) {
  return language === undefined ? (
    <FontAwesomeIcon icon={faFileLines} className="size-4" />
  ) : commandLineLanguages.includes(language) ? (
    <FontAwesomeIcon icon={faTerminal} className="size-4" />
  ) : (
    <FontAwesomeIcon icon={faFileLines} className="size-4" />
  );
}
