# Ice Docs

Source for the Ice documentation site: a Next.js + Markdoc application that publishes the Ice manual at
`/ice/<version>/<slug>` — for example `/ice/3.8/the-slice-language/user-defined-types/enumerations`. Each page carries
every language mapping it covers; the reader picks one (C++ until they do), and the choice is kept in the browser.

## Requirements

Node.js 22.22.2 or later in the 22 line, 24.15 or later in the 24 line, or 26 or later, and npm 11.16 or later; `.npmrc`
makes npm refuse to install on anything older. The scripts under `scripts/` import the TypeScript content model
directly, through the type stripping those releases enable by default.

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
npm run lint                       # lint:eslint, then lint:markdown
npm run lint:eslint                # eslint; a warning fails it too
npm run lint:markdown              # markdownlint on the content
npm run format                     # prettier, wraps Markdown prose at 120 columns
npm run format:check               # what CI runs
```

`dev` and `build` first regenerate the search index under `public/search/` (git-ignored), one file per version.

## Content layout

Everything for one version of the manual lives under `content/ice/<version>/` (for example `content/ice/3.8/`). A page
is a directory, and its path under the version is its slug, the path in its URL:

- `index.md` — the manual's front page, served at `/ice/<version>`. It is the first entry in the table of contents,
  ahead of the chapters, and the breadcrumb root links to it. The site root and `/ice` redirect to the newest version's.
  Its frontmatter lists the chapters under `pages:` and holds the version's settings: `status`, `languages`, and
  `previousVersions`.
- `<dir>/…/<page>/index.md` — a page, served at `/ice/<version>/<dir>/…/<page>`: the language-neutral text, with
  `{% language-section %}` slots. The pages under it in the manual are its subdirectories, in the order its frontmatter
  lists them under `pages:`.
- `<dir>/…/<page>/<lang>.md` — the overlay filling that page's slots, or, when no `index.md` sits beside it, the whole
  page for that language (`writing-a-greeter-client/cpp.md`).
- `redirects.yaml` — old URL to new URL.
- `examples/<lang>/...` — compilable snippet sources; `{% snippet %}` pulls fragments out of them.

Images live under `public/attachments/<version>/<page>/` and are referenced as `/attachments/<version>/<page>/<file>`.
Keep a shared figure in one page's attachment directory and reference that same asset from other pages instead of
duplicating it.

- **Every page is in the table of contents**: `check:content` fails a page that no `pages:` list reaches from the front
  page down.
- **Page names are globally unique** within a version, so a cross-page link can name a page by name.
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
  line of their own. Prettier's Markdown parser reads such a tag as a block, as Markdoc does, so `format` keeps it on
  its own line, with the blank lines around it as written, and `check:markdoc` rejects anything that slips through.
  Under a list item or a quoted line, a tag that spans several lines needs a blank line above it, or Prettier's parser
  reads it as part of that item or quote. An inline closer, `word{% /iflang %}`, has no space before it;
  `scripts/prettier-plugin-markdoc.js`, the parser `format` uses for Markdown, glues one written after a space to the
  word before it, so that line filling moves the two together.
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
