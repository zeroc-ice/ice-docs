# Ice documentation diagram style guide

This guide defines the visual language for diagrams that are authored directly as SVG. It is intentionally small: begin with a plain-language draft, apply these shared rules, and publish a self-contained SVG. Add a diagram-generation library only after repeated patterns justify it.

## Workflow and file locations

1. Write the structure and relationships in `diagrams/drafts/<name>.md`.
2. Start from `diagrams/template.svg` and place every element explicitly.
3. Render the SVG to a bitmap and inspect it at both full size and typical documentation width.
4. Publish the reviewed SVG below `public/attachments/` alongside the page that uses it.

The published SVG is the canonical drawing; do not keep a second copy below `diagrams/svg`. Retain a superseded image during review and remove it only when the replacement is accepted.

## Source fidelity

Preserve the source diagram's topology, containment, relative placement, and connector semantics unless a structural redesign is explicitly requested.

Before drawing, inventory the source's components, boundaries, adjacency, stacking order, and connectors. Treat geometry that communicates a relationship—such as a component sitting directly on a foundation block—as technical meaning. A visual refresh may improve typography, color, spacing, alignment, line treatment, labels, and symbols, but it must not introduce containers or relationships absent from the source.

## Canvas and layout

- Use a `viewBox`; do not set a fixed pixel width or height on the root SVG.
- Use a landscape `980 × 420` canvas for two-party architecture diagrams. Select a different aspect ratio when the content calls for it rather than adding empty space.
- Keep at least 16 units between content and the canvas edge and at least 24 units between unrelated components.
- Prefer compact, balanced compositions. Peer process or host boundaries should have matching dimensions whenever their contents permit it.
- Position components and route connectors explicitly. Do not rely on an automatic layout engine.
- Prefer orthogonal connector segments with rounded joins for architecture and network flows. Direct diagonal connectors are appropriate when they are part of the source grammar, such as inheritance branches or compiler output fans. Avoid crossings, and never route a connector through text.
- Keep boundaries, connectors, components, and labels in four separate, ordered SVG groups. Draw labels last.
- Trim the `viewBox` to the content plus the required outer margin. Excess canvas changes both centering and effective text size when the figure is embedded.
- Keep compact figures responsive within the normal prose track. Do not give every SVG a minimum width.
- For a genuinely wide figure, append `#diagram-wide` to its Markdown image target. The paragraph transform consumes this marker, assigns the wide track, and keeps the figure at least 720 pixels wide inside a local horizontal scroll container on narrower viewports.
- Author wide figures so their smallest standalone labels remain legible at the 720-pixel rendering floor.

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

| Role                                              | Size |  Weight |
| ------------------------------------------------- | ---: | ------: |
| Process, service, or runtime title                |   17 |     650 |
| Actor, state, interface, or major component label |   16 |     600 |
| Boundary or component label                       |   15 |     600 |
| Connector label                                   |   14 |     600 |
| Category badge, annotation, or IP address         |   13 | 500–750 |

Use sentence case. Set code identifiers and filenames in the shared monospace stack. Break long component labels into two centered lines with an 18–20-unit baseline step. Give boundary titles their own clear header area so no border, connector, or pattern crosses the text.

Thirteen units is the minimum size for standalone text. A superscript footnote glyph can be 11 units because it modifies an adjacent full-size label rather than carrying meaning on its own.

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
| Blocked path                   | —         | `#b42318` | 1.75, dashed, red × terminator |

Use color to reinforce a semantic distinction, never as its only indicator. ZeroC blue identifies primary Ice-owned runtime and service elements, such as an Ice core, object adapter, or Glacier2. Generated code uses the secondary violet treatment and retains an explicit `Generated` label. Avoid shadows, decorative gradients, and textures unless they encode information.

Published diagrams currently use an opaque white canvas in both light and dark documentation themes, matching the legacy raster-image treatment. Do not make only part of a diagram theme-aware; introduce a complete reviewed dark palette if adaptive diagrams are added later.

When category headers replace a legacy legend, set them in 13-unit bold type with modest letter spacing. Use blue `API` headers for Ice API/runtime elements and violet `GENERATED` headers for generated code.

Standard compact components are approximately `120 × 54`; application and generated-code components may be `165–180 × 62–72`. Keep at least 16 units of internal horizontal padding.

## Interface layer

Use an explicit interface layer when a diagram needs to show the architectural path between an application and its runtime. This middle layer can contain public APIs and generated bindings without implying that they belong to the same category.

- Make the application and runtime full-width cards on each side.
- Draw every interface component as a separate card with the same height.
- Give peer interface cards on the same side matching dimensions.
- Connect each application vertically and bidirectionally to its interface cards.
- Connect each interface card vertically and bidirectionally to its runtime.
- Keep the runtime-to-runtime network connection horizontal, and do not add horizontal relationships between interface cards.
- In an overview, represent the server API with one Ice API card. Put API internals such as the object adapter in a more detailed request-dispatch diagram rather than drawing them as peer interface cards.

This structure is a topology change and therefore requires an explicitly requested architectural redesign; it is not the default treatment for a faithful restyling.

## Connectors

Use `.connector` for the shared line treatment and add a semantic modifier: `.one-way`, `.two-way`, `.callback`, or `.blocked`. Family-specific connectors such as `.inheritance` are appropriate when their marker carries a different established meaning.

- Two-way: solid line with `marker-start` and `marker-end` set to `url(#arrow)`. Use it only when calls or messages and their replies genuinely flow in both directions.
- One-way: solid line with only `marker-end` set.
- Callback or asynchronous return: dashed `6 4` line with the appropriate arrow marker.
- Blocked: route the attempted connection from its source toward the blocking boundary and terminate it with the shared red × marker. Always label the blocked path.
- Network: use the standard connector color and place the label over a solid background that interrupts the line visually.
- Association or “uses”: plain solid line without arrowheads. Do not use a two-way arrow as a generic association.

Arrowheads, line style, and nearby labels must communicate direction and meaning without relying on color. Define each marker once in `<defs>` and use `orient="auto-start-reverse"` for a marker shared by both ends. Connect to deliberate ports on the edge of each component rather than its label area.

Connection count is part of a flow diagram's technical meaning. Do not turn one reused connection into two parallel lanes, or merge two independent connections into one. When several request directions share one bidirectional connection, use one two-headed line and label the reuse; show independent connections on separate lanes.

Put an opaque white rounded knockout behind text placed over a connector. Give the text enough horizontal padding to make the interruption intentional.

The bidirectional connectors in the client/server reference diagram summarize actual request-and-reply or API-call-and-return flow. Numbered flow diagrams should instead use separate one-way lanes when sequence or direction matters.

When a diagram contains both forward requests and callbacks, use solid arrows for the original request and dashed arrows for the callback. Include a compact legend unless the surrounding page already establishes this convention unambiguously.

Numbered steps use the shared 24-unit badge: a white circle with a 1.5-unit ZeroC-blue border and a centered 13-unit bold number. Define the circle once as `step-badge-shape` in `<defs>`, reuse it with `<use>`, and keep the number as native `<text>`.

## Boundaries and annotations

- Processes and hosts use the dashed boundary style. Name them at the top center inside the boundary.
- Ice API and other logical groupings use a solid boundary with a subtle tinted fill.
- Firewall devices use a distinct narrow component with a clear `Firewall` label. A firewall or policy boundary uses a labeled dashed line. Do not represent either with color alone.
- Network zones use labeled boundaries only when the zone itself is meaningful. Otherwise label the connector `Network`.
- Set addresses and ports in a 13-unit annotation immediately below the owning component, for example `IP: 10.0.0.1` or `tcp: 4061`.

## Accessibility and SVG hygiene

- Add `role="img"`, a short `<title>`, and a useful `<desc>` connected with `aria-labelledby`.
- Keep meaningful text as native SVG `<text>` and `<tspan>` elements. Do not use `<foreignObject>` and do not convert text to paths.
- Set `vector-effect="non-scaling-stroke"` on borders, dividers, and connectors.
- Define arrowheads once as `<marker>` elements rather than repeating arrow geometry.
- Omit fixed `width` and `height` attributes from the root SVG so documentation layouts can size it responsively.
- Mark purely structural connector groups `aria-hidden="true"` when the description already explains them.
- Use class names that describe semantic roles rather than appearance.
- Keep the SVG self-contained: no scripts, external fonts, runtime dependencies, or editor metadata.
- Format the source consistently and include comments only where they explain layout intent.

## Initial component vocabulary

- Process boundary
- API container
- Application component
- Runtime component
- Generated-code component
- Sectioned service component
- Bidirectional connector
- One-way flow connector
- Labeled network connector
- Blocked connector
- Actor pill
- Interface card and hollow inheritance arrow
- State pill, initial node, and final node
- Source-document shape
- Labeled shared-input boundary

## Diagram families

### Internal-structure diagrams

Use application components, interface-layer cards, runtime components, generated-code components, and boundaries only when the source calls for them. For an explicitly requested three-layer architectural view, make the application and runtime full width and place equal-sized API and generated-code cards between them. Two-way arrows are appropriate only when they summarize real calls and returns or requests and replies.

### Numbered network-flow diagrams

Use left-to-right network regions, labeled dashed boundaries, dual-homed or sectioned components, and symmetric one-way lanes. Solid connectors show the original request; dashed connectors show callbacks. Place endpoint and IP annotations immediately below their owning component. Show a failed connection as an attempted path from its source ending with the red × marker at the blocking boundary.

If a callback reuses an existing bidirectional connection, preserve that connection as one two-headed lane even though callbacks normally use the dashed request-flow treatment. Label the existing connection, and retain separate lanes wherever the source uses separate connections. Place explanatory blocked paths at the boundary that actually blocks them; a public/private network divider is not automatically a client firewall.

### Interface-inheritance diagrams

Use equal-sized neutral interface cards with an `INTERFACE` category header and monospace Slice identifiers. Point a hollow triangular marker from each derived interface toward its base. Direct diagonal branches are allowed because the fan-in geometry communicates inheritance. Do not add implicit roots or operation lists that belong to another figure.

### Protocol state machines

Use compact neutral pills for states, a solid circle for the initial node, and concentric circles for the final node. Put transition labels beside their paths. When multiple transitions merge into a shared lane, use small entry markers to preserve each direction and the standard arrow where the lane enters the target state. Render footnote marks as superscripts and keep their explanation near the marked states.

### Build-pipeline diagrams

Use actor pills for developers, document shapes for files, and primary blue components for Ice tools and runtime libraries. Use `SLICE`, `GENERATED`, and `SOURCE` category headers and monospace filenames. When generated files feed multiple builds, put them in one labeled shared group and draw a separate dependency from that group to every output. Use a white label knockout on the final RPC connector.

The current reference examples are:

- `public/attachments/3.8/basics/client-server.svg`: an explicitly requested three-layer internal structure.
- `public/attachments/3.8/callbacks-through-glacier2/callback-via-glacier2.svg`: numbered network flow, connection reuse, IP annotations, and a blocked path.
- `public/attachments/3.8/interface-inheritance/radioclock.svg`: multiple interface inheritance.
- `public/attachments/3.8/protocol-messages/protocol-state-machine.svg`: protocol states and shared transition lanes.
- `public/attachments/3.8/slice-compilation/slice-compilation.svg`: source and generated documents feeding shared build outputs.
