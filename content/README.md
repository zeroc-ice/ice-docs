# Writing a Page

Conventions for the pages under `content/`. The [repository README](../README.md) describes where the files go and how a
page and its overlays combine.

## Links

- Link to a page by a path relative to this one, `[Structures](../structures)`, or by its slug under the version,
  `[Enumerations](slice/user-defined-types/enumerations)`.
- Add `#<anchor>` to link to a heading.
- Add `?lang=<language>` to switch the reader to that mapping.
- Link to a type in the API reference by module and name: `[Communicator](api:Ice/Communicator)`. The reader gets the
  type's page in their language's API reference, as `api-links.yaml` lists it, or plain text where it lists none; add a
  new type there. Where the text means one language's API, such as the DataStorm C++ classes, link to that page
  directly.

## Headings

- Headings start at `##` and never skip a level. `## See Also` comes last.
- Titles and headings use Title Case: capitalize every word except articles, coordinating conjunctions, and prepositions
  of four letters or fewer, unless the word comes first or last. A name such as `icegridnode` or npm keeps its own case.
- An anchor is the heading text, lowercased, with hyphens for spaces and without `?`, `(`, or `)`:
  `## Asynchronous Method Dispatch (AMD)` is `#asynchronous-method-dispatch-amd`. When two headings on a page would
  share one, set it: `### Synopsis {% id="ice.default.host-synopsis" %}`.

## Tags

| Tag                                                                                                  | Use                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{% language-section name="…" /%}`                                                                   | In a shared page, a slot for the language overlays. In an overlay, `{% language-section name="…" %}…{% /language-section %}` answers it, or the self-closing form with `state="no-addition"` or `state="not-applicable" note="…"`. |
| `{% iflang langs="cpp,java" %}`                                                                      | A block or inline span shown only for those languages.                                                                                                                                                                             |
| `{% callout type="…" title="…" %}`                                                                   | A note box. `type` is `note`, `info`, `tip`, `important`, `warning`, `danger`, `deprecated`, or `compatibility`.                                                                                                                   |
| `{% id="…" %}`                                                                                       | After a heading, sets its anchor.                                                                                                                                                                                                  |
| `{% title="…" %}`                                                                                    | After a fence's language, captions the code block.                                                                                                                                                                                 |
| `{% snippet file="…" name="…" /%}`                                                                   | A fenced code block cut from a source file under `content/ice/<version>/`: the lines between `// <name>` and `// </name>` marker lines (`#` and `%` work too). The fence language comes from the file extension, or `lang="…"`.    |
| `{% aside %}`                                                                                        | Two columns side by side.                                                                                                                                                                                                          |
| `{% divider /%}`                                                                                     | A horizontal rule.                                                                                                                                                                                                                 |
| `{% step title="…" %}`                                                                               | A collapsible, numbered step in a walkthrough.                                                                                                                                                                                     |
| `{% prerequisites %}`                                                                                | A "Before you begin" box.                                                                                                                                                                                                          |
| `{% next-steps %}`                                                                                   | A "Next steps" box of links.                                                                                                                                                                                                       |
| `{% grid %}`, `{% card %}`, `{% selection /%}`, `{% releases %}`, `{% release /%}`, `{% showcase %}` | The front page's layout.                                                                                                                                                                                                           |

- Block tags go on their own line. Under a list item or quote, a tag spanning several lines needs a blank line above it.
- An inline closer has no space before it: `word{% /iflang %}`.

## Images

- Store a shared figure once and reference it from every page that uses it.
- A paragraph holding only an image renders as a figure; an image in a sentence stays inline. Use a plain image URL. See
  the [diagram style guide](../diagrams/STYLE-GUIDE.md) for SVG.

## Frontmatter

| Field                    | Use                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                  | The page title, and its `h1`.                                                                                                                                 |
| `pages`                  | The pages under this one, in sidebar order.                                                                                                                   |
| `description`            | A subtitle under the title, and the page's meta description. Search matches against it.                                                                       |
| `type`                   | The page's kind, shown as a badge above the title and on its search hits: `tutorial`, `how-to`, `concept`, `reference`, `troubleshooting`, or `release-note`. |
| `languages`              | The languages a shared page is written for. The sidebar and search leave it out for the others, whose readers get a note instead of its text.                 |
| `shape: wide`            | Runs the body on the wide track.                                                                                                                              |
| `showAside: false`       | Drops the right rail.                                                                                                                                         |
| `showReadingTime: false` | Drops the reading time.                                                                                                                                       |
| `showDividers: false`    | Drops the rule under each `##` heading.                                                                                                                       |
