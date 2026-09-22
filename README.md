# Ice Docs

Source for the Ice documentation site: a Next.js + Markdoc application that publishes the Ice manual for nine
programming languages at `/ice/<version>/<language>/<slug>` — for example
`/ice/3.8/cpp/the-slice-language/user-defined-types/enumerations`.

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

Everything for one version of the manual lives under `content/ice/<version>/` (for example `content/ice/3.8/`). A page
is a directory, and its path under the version is its slug, the path in its URL:

- `index.md` — the manual's front page, served at `/ice/<version>/<language>`. It sits above the tree rather than in it:
  the sidebar heading and the breadcrumb root link to it. The site root, `/ice`, and `/ice/<version>` redirect to a
  front page: the newest version's, in its first language, when they name no version.
- `<dir>/…/<page>/index.md` — a page, served at `/ice/<version>/<language>/<dir>/…/<page>`: the language-neutral text,
  with `{% language-section %}` slots. The pages under it in the manual are its subdirectories.
- `<dir>/…/<page>/<lang>.md` — the overlay filling that page's slots, or a page that exists in one language only
  (`writing-a-greeter-server-in-cpp/cpp.md` has no `index.md` beside it).
- `navigation.yaml` — the table of contents (one tree) and the languages.
- `redirects.yaml` — old URL to new URL.
- `examples/<lang>/...` — compilable snippet sources; `{% snippet %}` pulls fragments out of them.

A page's images live under `public/attachments/<version>/<page>/` and are referenced as
`/attachments/<version>/<page>/<file>`.

- **Page names are globally unique** within a version. The content tree follows the table of contents: `navigation.yaml`
  names pages by name, and `check:content` fails a page whose directory is not inside the directory of the group above
  it. A node with `language:` appears only in that language's table of contents.
- **Cross-page links name a page by name** (`[Enumerations](../enumerations)`) and are resolved at build time against
  the pages that exist for the reader's language. A link to a page that does not exist renders as plain text and is
  reported by `check:content`.
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
- **Release note pages** carry `date:` (an ISO date, quoted) in their frontmatter; the front page's release list shows
  it.
- **Page layout** switches live in the frontmatter too: `shape: wide` runs the whole body on the wide track,
  `showAside: false` drops the outline, and `showReadingTime: false` drops the reading time. The front page sets all
  three.

## Deployment

`npm run build` produces a standalone Next.js server; the `Dockerfile` packages it together with `public/` (attachments,
search index) and `.next/static`. The sitemap's base URL comes from `SITE_URL` (default `https://docs.zeroc.com/ice`);
`docker build --build-arg SITE_URL=…` passes it through.
