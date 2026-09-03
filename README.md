# Ice Docs

Source for the Ice documentation site: a Next.js + Markdoc application that
publishes the Ice manual for nine programming languages at
`/ice/<version>/<language>/<page>` — for example `/ice/3.8/cpp/enumerations`.

## Requirements

Node.js and npm.

## Building

```bash
npm install                        # install dependencies
npm run dev                        # dev server on http://localhost:3000
npm run build                      # production build (standalone), then the sitemap
npm test                           # unit tests for the content model (lib/docs-model, utils)
npm run check:content              # navigation, links, images, slots, migration leftovers
npm run check:content -- --strict  # also fail on unresolved links and missing images
npm run check:content -- --slots   # list the blank language sections still to classify
npm run lint                       # eslint
npm run format                     # prettier, over everything but the manual
npm run format:check               # what CI runs
```

`dev` and `build` first regenerate the search index under `public/search/`
(git-ignored), one file per version and language.

## Content layout

Everything for one version of the manual lives under `content/<version>/`
(for example `content/3.8/`):

- `navigation.yaml` — the table of contents (one tree), the languages, and the
  landing page.
- `redirects.yaml` — old URL to new URL.
- `shared/<slug>.md` — a language-neutral page, with `{% language-section %}`
  slots.
- `languages/<lang>/<slug>.md` — the overlay filling those slots, or a page
  that exists in one language only.
- `examples/<lang>/...` — compilable snippet sources; `{% snippet %}` pulls
  fragments out of them.

A page's images live under `public/attachments/<version>/<slug>/` and are
referenced as `/attachments/<version>/<slug>/<file>`.

- **Slugs are flat** and globally unique within a version. Where a page sits in
  the manual is `navigation.yaml`'s business, not the URL's; a node with
  `language:` appears only in that language's table of contents.
- **Cross-page links name a page by its slug** (`[Enumerations](../enumerations)`)
  and are resolved at build time against the pages that exist for the reader's
  language. A link to a page that does not exist renders as plain text and is
  reported by `check:content`.
- **A shared page and its overlay make one document per language.** The shared
  page declares `{% language-section name="…" /%}` slots; the overlay answers
  each one, with prose or with a declared state (`no-addition`, or
  `not-applicable` with a note), as described in `lib/docs-model/resolve.ts`.
  Small inline variation uses `{% iflang langs="…" %}`.
- **Images** live under `public/attachments/`, one directory per page. A paragraph
  that is nothing but an image renders as a figure; an image inside a sentence
  stays on the line.
- **Page kinds** (`type:` in frontmatter) are optional and currently unused.

## Deployment

`npm run build` produces a standalone Next.js server; the `Dockerfile` packages it
together with `public/` (attachments, search index) and `.next/static`. The
sitemap's base URL comes from `SITE_URL` (default `https://docs.zeroc.com/ice`);
`docker build --build-arg SITE_URL=…` passes it through.
