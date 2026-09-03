// Copyright (c) ZeroC, Inc.

'use client';

import { Key } from 'react';
import { faFileLines, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Fira_Mono } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Highlight } from 'prism-react-renderer';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

// Prism, extended with every grammar the manual needs. Passed to <Highlight>
// below so the import carries a value and cannot be tree-shaken away.
import prism from '@/utils/prism-languages';
import { CopyButton } from './copy-button';

import { iceCodeTheme } from '@/utils/prism-theme';

const firaMono = Fira_Mono({ weight: '400', subsets: ['latin', 'latin-ext'] });

const MermaidDiagram = dynamic(() => import('@/components/tags/mermaid'), {
  ssr: false
});

// Info strings the manual uses that are not Prism language ids.
const LANGUAGE_ALIASES: Record<string, string> = {
  proto: 'protobuf',
  // Ice configuration files: `Ice.Default.Locator=…` with `#` comments.
  config: 'properties',
  cfg: 'properties',
  ini: 'properties',
  text: '',
  txt: ''
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
  lineNumbers?: boolean;
  showTitle?: boolean;
};

export const CodeBlock = ({
  children,
  'data-language': language,
  title,
  lineNumbers = false,
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
      <Highlight
        prism={prism}
        theme={iceCodeTheme}
        language={language ?? ''}
        code={children?.trim()}
      >
        {({ className, tokens, getLineProps, getTokenProps, style }) => (
          <pre
            className={clsx(className, firaMono.className, 'my-2 pl-2.5')}
            style={style}
          >
            <code>
              {tokens.map((line, i) => {
                const { key, ...rest } = getLineProps({
                  line,
                  key: i,
                  className: 'ml-0 max-w-0 py-[3px] pr-5 text-xs'
                });
                const lineKey = key as Key;
                return (
                  <div key={lineKey} {...rest}>
                    {lineNumbers && (
                      <span className="mr-4 text-(--code-line-number)">{i + 1}</span>
                    )}
                    {line.map((token, tokenIndex) => {
                      const { key: tokenKey, ...rest } = getTokenProps({
                        token,
                        key: tokenIndex
                      });
                      return <span key={tokenKey as Key} {...rest} />;
                    })}
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
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
        {LanguageIcon(language ?? '')}
        {title ?? fixLanguage(language) ?? ''}
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

// A function to fix the spelling of the language
function fixLanguage(language: string) {
  if (language === 'csharp') {
    return 'C#';
  } else {
    return language;
  }
}
