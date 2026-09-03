// Copyright (c) ZeroC, Inc.

import path from 'path';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { load as yamlLoad } from 'js-yaml';

import { listVersions, readNavigationYaml, pageExists } from '@/lib/docs-model/content';
import { landingSlug, languageLabel, pageHref, type NavDoc, type NavNode } from '@/lib/docs-model/nav';
import { HeaderControls } from '@/components/ice/HeaderControls';
import type { LanguageOption } from '@/components/ice/LanguageSelect';
import type { VersionOption } from '@/components/ice/VersionSelect';

function contentRoot(): string {
  return path.join(process.cwd(), 'content');
}

function newestVersion(root: string): string | undefined {
  return [...listVersions(root)].sort().reverse()[0];
}

// The homepage: a way into the manual for the newest version. The chapters
// come straight from the table of contents, so this page and the sidebar can
// never disagree about what the manual contains.
export default function Home() {
  const root = contentRoot();
  const version = newestVersion(root);
  const nav = version ? (yamlLoad(readNavigationYaml(root, version) ?? '') as NavDoc) : null;
  const language = nav?.languages?.[0] ?? 'cpp';

  if (!nav || !version) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl font-bold">Ice Documentation</h1>
        <p className="text-ink-secondary mt-4">No documentation versions are published yet.</p>
      </div>
    );
  }

  const href = (slug: string) => pageHref(version, language, slug);
  const landing = landingSlug(nav);
  const startHref = href(landing);
  const languages = nav.languages ?? [];

  const available = (node: NavNode) => !!node.page && pageExists(root, version, language, node.page);

  // The manual's chapters, minus the front page (the hero already points there)
  // and the release notes, which get their own list below.
  const isReleaseNotes = (node: NavNode) => node.page === 'release-notes';
  const chapters = (nav.sidebar ?? []).filter(
    (node) => available(node) && node.page !== landing && !isReleaseNotes(node)
  );
  const releaseNotes = ((nav.sidebar ?? []).find(isReleaseNotes)?.items ?? []).filter(available);

  // The same controls the article pages put in the top bar. A reader who lands
  // here from a search engine can pick their version and language before they
  // read a single page, instead of discovering the switcher three clicks in.
  const languageOptions: LanguageOption[] = languages.map((lang) => ({
    value: lang,
    label: languageLabel(lang),
    href: `/ice/${version}/${lang}/${landing}`
  }));

  const versionOptions: VersionOption[] = listVersions(root).map((other) => ({
    value: other,
    href: `/ice/${other}/${language}`
  }));

  return (
    <div>
      <HeaderControls
        version={version}
        currentLanguage={language}
        languageOptions={languageOptions}
        versionOptions={versionOptions}
        previousVersions={nav.previousVersions}
      />

      {/* Hero. Deep indigo through to a desaturated teal — a gradient that reads
          as a technical manual rather than a product launch. */}
      <section className="relative overflow-hidden bg-[linear-gradient(110deg,#181743_0%,#1e3887_52%,#0a5f75_100%)] text-white">
        <div className="mx-auto max-w-180 px-6 py-16 sm:py-20">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/65">
            Ice {version}
          </p>
          <h1 className="mt-3 text-[clamp(2.25rem,4.2vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-white">
            Ice Documentation
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            Ice is a complete RPC framework for building secure, high-performance networked
            applications.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={startHref}
              className="inline-block rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#181743] transition hover:bg-white/90"
            >
              Get started
            </Link>
          </div>

          {/* The full list of mappings, in an order a reader can scan. */}
          {languages.length > 0 && (
            <div className="mt-9 border-t border-white/15 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">
                Available for
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 text-sm text-white/85">
                {languages.map((lang, i) => (
                  <li key={lang} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-white/30">
                        ·
                      </span>
                    )}
                    <Link
                      href={`/ice/${version}/${lang}/${landing}`}
                      className="rounded-sm transition hover:text-white hover:underline underline-offset-4"
                    >
                      {languageLabel(lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        {/* The manual, chapter by chapter */}
        <section>
          <h2 className="text-ink text-xl font-semibold">Browse the manual</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <HubCard key={chapter.page} href={href(chapter.page!)} title={chapter.title} />
            ))}
          </div>
        </section>

        {releaseNotes.length > 0 && (
          <section className="mt-14">
            <h2 className="text-ink text-xl font-semibold">Release notes</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {releaseNotes.map((page) => (
                <li key={page.page}>
                  <Link
                    href={href(page.page!)}
                    className="text-ink hover:text-link font-medium transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// Dark title with an arrow that arrives on hover, rather than a blue title: it
// keeps the page from reading as a grid of links and leaves blue meaning "this
// word is a link" everywhere else.
function HubCard({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="group border-hairline bg-surface hover:border-link/40 block rounded-[10px] border px-5 py-4 transition duration-150 hover:-translate-y-px hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
    >
      <div className="text-ink group-hover:text-link flex items-center gap-1.5 font-semibold transition-colors">
        {title}
        <ArrowRight
          aria-hidden="true"
          className="size-4 -translate-x-1 opacity-0 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
      {description && <p className="text-ink-secondary mt-1.5 text-sm">{description}</p>}
    </Link>
  );
}
