# Ice documentation diagram style guide

This guide defines reusable visual and accessibility conventions for diagrams authored directly as self-contained SVGs.

## Workflow and file locations

1. Inventory the source's structure and relationships, and record intentional semantic changes in the issue or pull
   request.
2. Use `diagrams/template.svg` as a starting point, keeping only the styles and shapes the figure needs. Place every
   element explicitly.
3. Render the SVG to a bitmap and inspect it at both full size and typical documentation width.
4. Publish the reviewed SVG under `public/images/ice/<version>/<page>/`. Reuse the same asset when multiple pages show
   the same figure.

## Source fidelity

Preserve the source diagram's topology, containment, relative placement, and connector semantics unless a structural
redesign is explicitly requested.

Before drawing, inventory the source's components, boundaries, adjacency, stacking order, and connectors. Treat geometry
that communicates a relationship—such as a component sitting directly on a foundation block—as technical meaning. A
visual refresh may improve typography, color, spacing, alignment, line treatment, labels, and symbols, but it must not
introduce containers or relationships absent from the source.

## Canvas and layout

- Set a `viewBox` for the drawing coordinates and proportional `width` and `height` attributes for its native display
  size. Keep the native width at most 700 pixels; use a smaller width for a compact figure.
- The page limits figures to the available column width and preserves their aspect ratio. Intrinsic dimensions keep
  small figures from being enlarged to fill the column.
- Choose the aspect ratio to fit the content rather than adding empty space.
- Keep at least 16 units between content and the canvas edge and at least 24 units between unrelated components.
- Prefer compact, balanced compositions. Peer process or host boundaries should have matching dimensions whenever their
  contents permit it.
- Position components and route connectors explicitly. Do not rely on an automatic layout engine.
- Prefer orthogonal connector segments with rounded joins for architecture and network flows. Direct diagonal connectors
  are appropriate when they are part of the source grammar, such as inheritance branches or compiler output fans. Avoid
  crossings, and never route a connector through text.
- Keep boundaries, connectors, components, and labels in four separate, ordered SVG groups. Draw labels last.
- Trim the `viewBox` to the content plus the required outer margin. Excess canvas changes both centering and effective
  text size when the figure is embedded.
- Use a plain Markdown image reference whose alt text describes what the figure shows, not just its title. Add an
  optional caption as an italic paragraph directly below the image, in sentence case with a final period, for example
  `_Nested invocation deadlock._`, when the surrounding text does not already introduce the figure.
- Figures fit the article column without a special marker or scroll region.
- Inspect figures at their native size and in the page at laptop and narrow viewport widths. If labels are too small,
  compact or rearrange the drawing and increase type sizes rather than introducing a minimum image width.

## Typography

Use the documentation UI font stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

Use bold component labels and lighter annotation text. Most published diagrams, and the template, use 16-unit component
labels and 14-unit annotations; the pilot figures and some dense flow diagrams use more specific roles and sizes. These
sizes are starting points, not a fixed scale for every canvas. SVG units scale with the image: judge readability at the
native display size and at the width available on the page.

Use sentence case. Set code identifiers and filenames in the shared monospace stack. Break long component labels into
centered lines with enough baseline spacing for their type size. Give boundary titles their own clear header area so no
border, connector, or pattern crosses the text.

## Color and shape roles

| Role                           | Fill      | Stroke    | Treatment                      |
| ------------------------------ | --------- | --------- | ------------------------------ |
| Canvas                         | `#ffffff` | —         | Opaque background              |
| Process or host boundary       | `#fbfcfe` | `#cbd3de` | 1.5, dashed `7 5`, radius 14   |
| Ice API or logical boundary    | `#f8fbff` | `#4f78bb` | 1.5, solid, radius 8           |
| Application component          | `#ffffff` | `#8d99aa` | 1.5, solid, radius 7           |
| Primary Ice runtime or service | `#eef5ff` | `#1259d6` | 1.75, solid, radius 7–8        |
| Generated code                 | `#f3f0f7` | `#75658f` | 1.75, solid, radius 7          |
| Text                           | —         | —         | `#182235`                      |
| Connector                      | —         | `#566174` | 1.75, rounded                  |
| Inheritance connector          | —         | `#465266` | 2, hollow triangle marker      |
| Divider inside a component     | —         | `#a6afbc` | 1.25, solid                    |
| Network zone boundary          | —         | `#7a8699` | 1.5, dashed `7 5`              |
| Blocked path                   | —         | `#b42318` | 1.75, dashed, red × terminator |

Use color to reinforce a semantic distinction, never as its only indicator. ZeroC blue identifies primary Ice-owned
runtime and service elements. Generated code uses the secondary violet treatment and retains an explicit `Generated`
label. Avoid shadows, decorative gradients, and textures unless they encode information.

Published diagrams currently use an opaque white canvas in both light and dark documentation themes, matching the legacy
raster-image treatment. Do not make only part of a diagram theme-aware; introduce a complete reviewed dark palette if
adaptive diagrams are added later.

When category headers replace a legacy legend, use small bold type with modest letter spacing. Use blue `API` headers
(`#365f9e`) for Ice API/runtime elements and violet `GENERATED` headers (`#68587e`) for generated code. These shades are
darker than the matching strokes so that small type stays legible on the tinted fills.

Standard compact components are approximately `120 × 54`; application and generated-code components may be
`165–180 × 62–72`. Keep at least 16 units of internal horizontal padding.

## Connectors

Use `.connector` for the shared line treatment and add a semantic modifier: `.one-way`, `.two-way`, `.callback`,
`.blocked`, `.topic-link`, or `.through-firewall`. Family-specific connectors such as `.inheritance` are appropriate
when their marker carries a different established meaning.

- Two-way: solid line with `marker-start` and `marker-end` set to `url(#arrow)`. Use it only when calls or messages and
  their replies genuinely flow in both directions.
- One-way: solid line with only `marker-end` set.
- Callback or asynchronous return: dashed `6 4` line with the appropriate arrow marker.
- Blocked: dashed red line from the source toward the blocking boundary, ending at a red × (`.blocked-cross`) drawn
  where the connection is refused. Always label the blocked path.
- Topic link: dotted `1 5` line with `marker-end`, for a link between IceStorm topics as opposed to message delivery.
  State the distinction in a legend or in the surrounding text.
- Through a firewall: dotted `2 5` segment across the firewall component, continuing the connection that traverses it.
- Network: use the standard connector color and place the label over a solid background that interrupts the line
  visually.
- Association or “uses”: plain solid line without arrowheads. Do not use a two-way arrow as a generic association.

Do not give an existing line style a new meaning; add and document a new role instead. Arrowheads, line style, and
nearby labels must communicate direction and meaning without relying on color. Define each marker once in `<defs>` and
use `orient="auto-start-reverse"` for a marker shared by both ends. Connect to deliberate ports on the edge of each
component rather than its label area.

Connection count is part of a flow diagram's technical meaning. Do not turn one reused connection into two parallel
lanes or merge two independent connections into one.

Put an opaque white rounded knockout behind text placed over a connector. Give the text enough horizontal padding to
make the interruption intentional.

When a diagram contains both forward requests and callbacks, use solid arrows for the original request and dashed arrows
for the callback. Include a compact legend unless the surrounding page already establishes this convention
unambiguously.

Numbered steps use a white circular badge with a ZeroC-blue border and a centered number. The template provides a
24-unit badge; size the number and nearby label for the figure. Define the circle once as `step-badge-shape` in
`<defs>`, reuse it with `<use>`, and keep the number as native `<text>`. Leave a visible gap between the badge and its
label.

## Boundaries and annotations

- Processes and hosts use the dashed boundary style. Name them at the top center inside the boundary.
- Ice API and other logical groupings use a solid boundary with a subtle tinted fill.
- Firewall devices use a distinct narrow component with a clear `Firewall` label. A firewall or policy boundary uses a
  labeled dashed line. Do not represent either with color alone.
- Network zones use labeled boundaries only when the zone itself is meaningful. Use a dashed `7 5` line with a 1.5-unit
  `#7a8699` stroke so it remains visible at page size. Keep this stronger network boundary distinct from the lighter
  host outlines, and interrupt it behind labels. Otherwise label the connector `Network`.
- Set addresses and ports in annotation text immediately below the owning component, for example `IP: 10.0.0.1` or
  `tcp: 4061`.

## Accessibility and SVG hygiene

- Add `role="img"`, a short `<title>`, and a useful `<desc>` connected with `aria-labelledby`.
- Keep meaningful text as native SVG `<text>` and `<tspan>` elements. Do not use `<foreignObject>` and do not convert
  text to paths.
- Set `vector-effect="non-scaling-stroke"` on borders, dividers, and connectors.
- Define arrowheads once as `<marker>` elements rather than repeating arrow geometry.
- Keep the root `width` and `height` proportional to the `viewBox`; the page uses `max-width: 100%` and `height: auto`.
- Mark purely structural connector groups `aria-hidden="true"` when the description already explains them.
- Use class names that describe semantic roles rather than appearance. Names are local to each self-contained SVG:
  published figures commonly use `.boundary`, `.api`, and `.application`, while the template offers more specific roles
  such as `.process-boundary` and `.api-boundary`. A label background can use `.label-knockout` or an explicit white
  fill; its purpose is to keep lines from crossing the text.
- Keep the SVG self-contained: no scripts, external fonts, runtime dependencies, or editor metadata.
- Format the source consistently and include comments only where they explain layout intent.
