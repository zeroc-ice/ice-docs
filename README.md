# Ice Docs

Source for the Ice documentation site: a Next.js + Markdoc application that publishes the Ice manual at
`/ice/<version>/<slug>` — for example `/ice/3.8/the-slice-language/user-defined-types/enumerations`. Each page carries
every language mapping it covers; the reader picks one (C++ until they do), and the choice is kept in the browser.

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
npm run check:content              # navigation, links, images, slots, titles, migration leftovers
npm run check:content -- --strict  # also fail on unresolved links and missing images
npm run check:content -- --slots   # list the blank language sections still to classify
npm run check:markdoc              # every page against the Markdoc schema; `build` runs it first
npm run lint                       # eslint
npm run format                     # prettier, wraps Markdown prose at 120 columns
npm run format:check               # what CI runs
```

`dev` and `build` first regenerate the search index under `public/search/` (git-ignored), one file per version.

## Content layout

Everything for one version of the manual lives under `content/ice/<version>/` (for example `content/ice/3.8/`). A page
is a directory, and its path under the version is its slug, the path in its URL:

- `index.md` — the manual's front page, served at `/ice/<version>`. It sits above the tree rather than in it: the
  sidebar heading and the breadcrumb root link to it. The site root and `/ice` redirect to the newest version's.
- `<dir>/…/<page>/index.md` — a page, served at `/ice/<version>/<dir>/…/<page>`: the language-neutral text, with
  `{% language-section %}` slots. The pages under it in the manual are its subdirectories.
- `<dir>/…/<page>/<lang>.md` — the overlay filling that page's slots, or, when no `index.md` sits beside it, the whole
  page for that language (`writing-a-greeter-client/cpp.md`).
- `navigation.yaml` — the table of contents (one tree) and the languages.
- `redirects.yaml` — old URL to new URL.
- `examples/<lang>/...` — compilable snippet sources; `{% snippet %}` pulls fragments out of them.

Images live under `public/attachments/<version>/<page>/` and are referenced as `/attachments/<version>/<page>/<file>`.
Keep a shared figure in one page's attachment directory and reference that same asset from other pages instead of
duplicating it.

- **Page names are globally unique** within a version. The content tree follows the table of contents: `navigation.yaml`
  names pages by name, and `check:content` fails a page whose directory is not inside the directory of the group above
  it.
- **Cross-page links name a page by name** (`[Enumerations](../enumerations)`) and are resolved at build time. A link to
  a page that does not exist renders as plain text and is reported by `check:content`.
- **A page and its overlays make one document.** The shared page declares `{% language-section name="…" /%}` slots; each
  overlay answers each one, with prose or with a declared state (`no-addition`, or `not-applicable` with a note), as
  described in `lib/docs-model/resolve.ts`. Each distinct answer goes into the page once, wrapped in
  `{% iflang langs="…" %}` for the languages that gave it, which is also how a page marks small inline variation itself.
  A `no-addition` answer, or a blank one, adds nothing.
- **The reader's language decides what shows.** The stylesheet shows the blocks of the language chosen in the top bar
  and remembered in local storage, so switching language never leaves the page. An incoming link can pick the language
  with `?lang=<language>`, which is applied, remembered, and dropped from the address; a link copied from a heading in
  one language's section carries it.
- **A page written per language is one page too.** In a directory without `index.md`, each `<lang>.md` is the page for
  its language, and they share one title. The sidebar, previous/next, and search leave it out for readers of the other
  languages, and one who lands on it anyway gets a note naming the languages it is written for.
- **Tags stand on their own line.** `{% callout %}`, `{% language-section %}` and a block-level `{% iflang %}` go on a
  line of their own, with a blank line on each side outside tight lists. Prettier on its own would reflow a tag written
  against its prose into the paragraph, which turns it into an inline tag; `scripts/prettier-plugin-markdoc.js`, the
  parser `format` uses for Markdown, keeps each tag on its own line instead, and `check:markdoc` rejects anything that
  slips through. Two things the parser cannot tell apart from prose: a numbered list or a table right under a tag line.
  Put a blank line between them. An inline closer, `word{% /iflang %}`, has no space before it.
- **Images** live under `public/attachments/`. A paragraph that is nothing but an image renders as a figure; an image
  inside a sentence stays on the line. SVG figures declare a native size and shrink to fit the article column. Use a
  plain image URL; no sizing fragment is needed. See the [diagram style guide](diagrams/STYLE-GUIDE.md) for SVG
  authoring.
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
