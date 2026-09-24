# Agent instructions

`README.md` describes the content layout, the shared-page and overlay model, the Markdoc tag rules and the commands.
Read it first. This file covers the conventions that recur in review.

## Writing

- **Active voice, with the actor named.** "IceSSL resolves a relative `path` under the directory named by
  `IceSSL.DefaultDir`", not "a relative `path` is resolved under the directory named by `IceSSL.DefaultDir`". When the
  actor is one side of a connection, name what the reader configures: "an object adapter accepting an incoming
  connection" rather than "the server".
- **One statement per fact.** Delete a sentence that restates the one before it or that follows from the rule already
  given.
- **Do not define by negation, and do not write against the text you are replacing.** "IceSSL never prompts for the
  password" answers an older claim; the reader needs only the rule that holds.
- **Prefer the plain word.** "cannot determine the revocation status" over "an undeterminable revocation status".

## Accuracy

- **Verify every claim against the implementation.** Read the code in `zeroc-ice/ice` for the release the page
  documents, and list the files and symbols you relied on in the PR description, so a reviewer can check the claim
  without rediscovering the code.
- **A general statement must hold for every platform and language mapping the page serves.** A page-wide rule followed
  by a platform note that contradicts it misleads the reader who stops at the rule; qualify the rule itself.
- **A page documents the release as it is.** Properties removed since the previous release, changes made in a patch
  release and other version history belong in the release notes, the changelog or the upgrade guide.
- **Fix every copy of what you fix.** Prose is copied between the language overlays of a page and between related pages.
  After correcting one, grep for the same sentence in the sibling overlays and fix or report those too.

## Property reference

- **Describe the behavior, not the advice.** A property entry says what the property does; what an application typically
  sets belongs in the guide that covers the feature.
- A table of property values gets a `| Value | Description |` header row. Without one, Markdown renders the first value
  row as the header.

## Markdown

- `npm run format` wraps prose at 120 columns and keeps Markdoc tags on their own line; run it, plus
  `npm run check:content` and `npm run check:markdoc`, before pushing.

## Diagrams and images

- **`diagrams/STYLE-GUIDE.md` is normative.** Read it before drawing or editing a figure: it defines the canvas and
  layout rules, the color and shape roles, the connector grammar, and the accessibility and SVG hygiene requirements.
  Start from `diagrams/template.svg`, and publish the SVG under `public/attachments/<version>/<page>/`.
- **Alt text describes what the figure shows**, in the identifiers the surrounding page uses. A name that appears only
  in the drawing leaves the reader unable to match the figure to the configuration they are following.

## Code

- Comments explain what the code cannot say for itself. Do not add a comment that narrates the markup or restates the
  class names on the line below it.

<!-- prettier-ignore-start -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- prettier-ignore-end -->
