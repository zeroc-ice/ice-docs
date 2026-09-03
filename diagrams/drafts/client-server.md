# Ice client and server structure — three-layer architecture

This diagram is an explicitly requested architectural clarification of
`public/attachments/3.8/basics/client-server.gif`. It retains the original components and their
client/server roles while replacing physical stacking with consistent relationships between three
layers.

## Composition

Arrange the client and server side by side. Each side has three vertical layers:

1. A full-width application card.
2. A row of separate, equal-height interface cards.
3. A full-width Ice runtime card.

The client interface row contains two matching cards:

- Generated proxy code
- Ice API

The server interface row contains two matching cards:

- Ice API
- Generated skeleton code

Every application connects vertically and bidirectionally to each interface card below it. Every
interface card connects vertically and bidirectionally to its runtime. Only the Client Ice core and
Server Ice core connect horizontally, using a bidirectional connector labeled `Network`.

Do not add process or API containment boundaries and do not add horizontal relationships between
interface cards.

## Presentation

- Applications use the neutral application style.
- The client and server Ice API cards use the blue `API` header and pale-blue API style.
- Proxy and skeleton cards use the violet `GENERATED` header and generated-code style.
- Both runtime cards use the stronger blue runtime treatment.
- All four interface cards share the same dimensions and shape.
- Use only straight vertical connectors between adjacent layers and one straight horizontal network
  connector between the runtimes.

The object adapter remains part of the explanatory text below the figure. Do not draw it as a peer of
the Ice API in this overview; reserve that detail for a request-dispatch diagram.

Original reference: `public/attachments/3.8/basics/client-server.gif`

Canonical SVG: `public/attachments/3.8/basics/client-server.svg`

Comparison SVG: `diagrams/comparisons/client-server-reinterpretation.svg`
