# Ice Docs

Source for the Ice documentation site: a Next.js + Markdoc application that publishes the Ice manual for nine
programming languages at `/ice/<version>/<language>/<page>` — for example `/ice/3.8/cpp/enumerations`.

## Requirements

Node.js 22.18 or later in the 22 line, or 23.6 or later, and npm. The scripts under `scripts/` import the TypeScript
content model directly, which relies on the type stripping Node enables by default from those releases (23.0 to 23.5
have it behind a flag).

## Building

```bash
npm install                        # install dependencies
npm run dev                        # dev server on http://localhost:3000
npm run build                      # production build (standalone), then the sitemap
npm test                           # unit tests for the content model (lib/docs-model, utils)
npm run check:content              # navigation, links, images, slots, migration leftovers
npm run check:content -- --strict  # also fail on unresolved links and missing images
npm run check:content -- --slots   # list the blank language sections still to classify
npm run check:markdoc              # every page against the Markdoc schema; `build` runs it first
npm run lint                       # eslint
npm run format                     # prettier, wraps Markdown prose at 120 columns
npm run format:check               # what CI runs
```

`dev` and `build` first regenerate the search index under `public/search/` (git-ignored), one file per version and
language.

## Content layout

Everything for one version of the manual lives under `content/<version>/` (for example `content/3.8/`):

- `navigation.yaml` — the table of contents (one tree), the languages, and the landing page.
- `redirects.yaml` — old URL to new URL.
- `shared/<slug>.md` — a language-neutral page, with `{% language-section %}` slots.
- `languages/<lang>/<slug>.md` — the overlay filling those slots, or a page that exists in one language only.
- `examples/<lang>/...` — compilable snippet sources; `{% snippet %}` pulls fragments out of them.

A page's images live under `public/attachments/<version>/<slug>/` and are referenced as
`/attachments/<version>/<slug>/<file>`.

- **Slugs are flat** and globally unique within a version. Where a page sits in the manual is `navigation.yaml`'s
  business, not the URL's; a node with `language:` appears only in that language's table of contents.
- **Cross-page links name a page by its slug** (`[Enumerations](../enumerations)`) and are resolved at build time
  against the pages that exist for the reader's language. A link to a page that does not exist renders as plain text and
  is reported by `check:content`.
- **A shared page and its overlay make one document per language.** The shared page declares
  `{% language-section name="…" /%}` slots; the overlay answers each one, with prose or with a declared state
  (`no-addition`, or `not-applicable` with a note), as described in `lib/docs-model/resolve.ts`. Small inline variation
  uses `{% iflang langs="…" %}`.
- **Tags stand on their own line.** `{% callout %}`, `{% language-section %}` and a block-level `{% iflang %}` go on a
  line of their own, with a blank line on each side outside tight lists. Prettier on its own would reflow a tag written
  against its prose into the paragraph, which turns it into an inline tag; `scripts/prettier-plugin-markdoc.mjs`, the
  parser `format` uses for Markdown, keeps each tag on its own line instead, and `check:markdoc` rejects anything that
  slips through. Two things the parser cannot tell apart from prose: a numbered list or a table right under a tag line.
  Put a blank line between them. An inline closer, `word{% /iflang %}`, has no space before it.
- **Images** live under `public/attachments/`, one directory per page. A paragraph that is nothing but an image renders
  as a figure; an image inside a sentence stays on the line.
- **Page kinds** (`type:` in frontmatter) are optional and currently unused.

## Deployment

`npm run build` produces a standalone Next.js server; the `Dockerfile` packages it together with `public/` (attachments,
search index) and `.next/static`. The sitemap's base URL comes from `SITE_URL` (default `https://docs.zeroc.com/ice`);
`docker build --build-arg SITE_URL=…` passes it through.
