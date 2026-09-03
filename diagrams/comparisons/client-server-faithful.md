# Ice client and server structure — faithful-restyling comparison

Preserve the topology, containment, relative placement, and connector semantics of `public/attachments/3.8/basics/client-server.gif`.

## Composition

- The Client Ice core and Server Ice core are wide foundation blocks on the same baseline.
- The client has Proxy code on the left and Ice API on the right, both stacked directly on its core.
- The server has Ice API on the left, Skeleton code near the center on a raised portion of the core, and Object adapter on the right.
- Client application and Server application are wide boxes above their respective structures.
- The application has bidirectional vertical connectors only to the components shown in the source:
  - Client application ↔ Proxy code
  - Client application ↔ Ice API
  - Server application ↔ Ice API
  - Server application ↔ Skeleton code
  - Server application ↔ Object adapter
- The client and server cores connect bidirectionally through the network.

Do not draw containers around the cores. Do not add connectors between a stacked component and its core; their adjacency is the relationship encoded by the source geometry.

## Presentation refresh

- Use the shared contemporary typography and semantic palette.
- Use small `API` and `GENERATED` header badges instead of the original hatched legend.
- Use modest rounding, consistent non-scaling strokes, and the shared arrow marker.
- Retain a compact, cleaned-up network symbol and its label below the connection.
- Do not add optional process boundaries.

Original reference: `public/attachments/3.8/basics/client-server.gif`

Comparison SVG: `diagrams/comparisons/client-server-faithful.svg`
