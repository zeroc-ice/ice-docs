# Agent instructions

Read `README.md` before working on the site, and `content/README.md` before writing or editing a page. This file covers
the conventions that recur in review.

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
- **Lead with what it does.** Open with what the feature, directive, or option does; its scope, default, and special
  values follow.
- **Name things precisely.** An operation whose return type is a proxy returns a proxy, not the Ice object or topic it
  refers to, and a servant has no proxy: the proxy is for the Ice object the servant implements. `tcp`, `ssl`, `ws`, and
  `wss` are transports, not protocols. The members of a Slice struct are fields. Ice marshals and unmarshals; encode and
  decode are the words of IceRPC, and the Ice Encoding keeps its name.

## What a page leaves out

- **The rule, not the failure mode.** A page says what the reader must do and what Ice does. Which exception a violation
  throws, what Ice does with invalid input, and what happens after a misconfiguration stay out. Defaults and the limits
  a reader hits stay.
- **What the API reference documents.** Method-by-method lists, the exceptions a method throws, and per-method contracts
  such as "this callback must not throw" belong to the API reference; a page gives the rules it does not, and links to
  it.
- **Implementation detail and rationale.** Describe what the reader observes, not how Ice achieves it: when a queue gets
  trimmed, how promptly a step happens. Give the reason for a rule only when the reader needs it to apply the rule.
- **Deprecated options, properties, and APIs**, and the warnings they produce. Do not add them; whether an existing
  entry stays is decided case by case.
- **Known bugs.** State the intended rule, and file the bug in a `zeroc-ice/ice` issue.

## Accuracy

- **Verify every claim against the implementation.** Read the code in `zeroc-ice/ice` for the release the page
  documents, and list the files and symbols you relied on in the PR description, so a reviewer can check the claim
  without rediscovering the code.
- **A general statement must hold for every platform and language mapping the page serves.** A page-wide rule followed
  by a platform note that contradicts it misleads the reader who stops at the rule; qualify the rule itself.
- **A page documents the release as it is.** Properties removed since the previous release, changes made in a patch
  release and other version history belong in the release notes, the changelog or the upgrade guide.
- **Document the configuration the reader will use, not every configuration the code allows.** A rule that holds for the
  mainstream setup stays simple, and a rarely used alternative appears only on the page that documents it. For example,
  the `Process` facet registers with the communicator's default locator; `Ice.Admin.Locator` and an admin object hosted
  in an application adapter through `createAdmin` do not qualify that sentence.
- **Fix every copy of what you fix.** Prose is copied between the language overlays of a page and between related pages.
  After correcting one, grep for the same sentence in the sibling overlays and fix or report those too. Overlays that
  state the same rule use the same wording.

## Language mappings

- **Leave a page out with `languages`.** When a page does not apply to a mapping, list the mappings it applies to in its
  `languages` frontmatter. Do not add an overlay or a callout that tells the reader the page is not for them.
- **Ice for Ruby, PHP, and MATLAB are client-only.** They have no object adapters, no dispatch, and no AMI callbacks, so
  pages about these topics leave them out. Ice for JavaScript has no administrative facility.
- **Say it once on the shared page.** A sentence that every overlay would repeat belongs on the shared page.

## Encoding and protocol pages

- **These pages define the layout**, not what the runtime does while it marshals or unmarshals. The passive "is encoded
  as" is right here: the subject is the byte layout, not an actor.
- **The encoding pages give no instructions to an encoder** ("must"). On the protocol pages, what each peer must do is
  the protocol itself.
- **The protocol pages stop at the encapsulation.** What a request or reply payload holds belongs to the encoding pages;
  the protocol page links to them from See Also only.

## Code samples

- **A code sample is an excerpt of the reader's program.** It can rely on context the page doesn't show:
  `using namespace` directives, imports, earlier declarations, and a Slice definition's enclosing module. Fix what a
  sample gets wrong about Ice 3.8, such as a name, a signature, a value, or a command, and qualify names the way the
  other samples on the page do.

## Property reference

- **Describe the behavior, not the advice.** A property entry says what the property does; what an application typically
  sets belongs in the guide that covers the feature.
- **Boolean properties take `1` and `0`.** Say what to set, "set `Ice.UseSyslog` to `1`", and document `1` and `0` only,
  not every value the parser accepts.
- A table of property values gets a `| Value | Description |` header row. Without one, Markdown renders the first value
  row as the header.

## Pages and pull requests

- **A deleted page gets no redirect by default.** Redirect only when another page covers the topic, as
  `content/ice/3.8/redirects.yaml` does for its removed pages, and remove the redirects that pointed to the deleted
  page.
- **File the follow-up you defer.** When a PR description defers part of the work to a follow-up issue, file it and link
  it, or drop the sentence.

## Markdown

- `npm run format` wraps prose at 120 columns and keeps Markdoc tags on their own line; run it, plus
  `npm run lint:markdown`, `npm run check:content`, and `npm run check:markdoc`, before pushing.

## Diagrams and images

- **`diagrams/STYLE-GUIDE.md` is normative.** Read it before drawing or editing a figure: it defines the canvas and
  layout rules, the color and shape roles, the connector grammar, and the accessibility and SVG hygiene requirements.
  Start from `diagrams/template.svg`, and publish the SVG under `public/images/ice/<version>/<page>/`.
- **Alt text describes what the figure shows**, in the identifiers the surrounding page uses. A name that appears only
  in the drawing leaves the reader unable to match the figure to the configuration they are following.

## Code

- Comments explain what the code cannot say for itself. Do not add a comment that narrates the markup or restates the
  class names on the line below it.
- Use Tailwind's standard sizes, such as `text-sm`, `w-24`, and `tracking-wider`, rather than arbitrary values such as
  `text-[13px]`. Keep an arbitrary value for what the scale cannot express: a calculation such as `calc()` or `clamp()`,
  or a size relative to the surrounding text such as `text-[0.9em]`.

## Keyboard and screen readers

- A control carries `focus-ring`, a bare text link `focus-ring-text`; see `app/globals.css`. A menu item highlights by
  background instead, and a scroll target draws no ring.
- A control has a name and a state: an `aria-label` or `sr-only` text where it shows no text, and `aria-expanded` or
  `aria-pressed` where it toggles.

<!-- prettier-ignore-start -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- prettier-ignore-end -->
