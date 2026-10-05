# Ice Documentation

Source for [docs.zeroc.com](https://docs.zeroc.com), the documentation for [Ice](https://github.com/zeroc-ice/ice).

## Requirements

- [Node.js](https://nodejs.org/) 24 or later
- [npm](https://www.npmjs.com/) 11.16 or later

## Getting started

```bash
npm install    # install dependencies
npm run dev    # dev server on http://localhost:3000
npm run build  # build the site
```

## Development workflow

```bash
npm test               # unit tests for the content model
npm run check:content  # navigation, images, headings, language slots
npm run check:markdoc  # every page against the Markdoc schema, every link resolved
npm run lint           # eslint and markdownlint
npm run format         # prettier
```

CI runs the same checks, so run them before pushing.

## Repository layout

Each page of the docs is a directory under `content/`, and its path there is its URL:
`content/ice/3.8/slice/user-defined-types/enumerations/` is served at `/ice/3.8/slice/user-defined-types/enumerations`.

| Path                                     | Contents                                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/ice/<version>/<page>/index.md`  | The page's shared text, with `{% language-section %}` slots. The pages under it are its subdirectories, listed under `pages:`; the version's own `index.md` is the front page. |
| `content/ice/<version>/<page>/<lang>.md` | Fills the slots for one language, or is the whole page when there is no `index.md`.                                                                                            |
| `app/ice/<version>/`                     | The route serving that release's documentation; its `version.ts` holds the path, title, status, and languages.                                                                 |
| `content/…/redirects.yaml`               | Redirects, `permanent` or `temporary`, relative to the directory's own URL; `include` names files beside it.                                                                   |
| `content/ice/<version>/api-links.yaml`   | Each type's page in the API reference of each language that has one, for `api:` links.                                                                                         |
| `public/images/ice/<version>/<page>/`    | Page images.                                                                                                                                                                   |
| `public/images/site/`                    | Images the site itself uses.                                                                                                                                                   |

A page and its overlays render as one document: each distinct answer to a slot appears once, wrapped in `{% iflang %}`
for its languages, and the stylesheet shows the reader's. `lib/docs-model/resolve.ts` has the slot states.

## Contributing

Before writing or changing content, read the conventions:

- [content/README.md](content/README.md) for pages: links, headings, tags, images, and frontmatter.
- [diagrams/STYLE-GUIDE.md](diagrams/STYLE-GUIDE.md) for figures.
