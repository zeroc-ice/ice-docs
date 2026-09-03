# Ice client and server structure — reinterpretation comparison

This draft intentionally reinterprets the source using process and API containment. It is retained during the pilot for comparison with the canonical `client-server.md`; it is not a topology-preserving restyling.

Landscape layout with two equal-size process boundaries, client on the left and server on the right.

## Client process

- Client application on the left.
- Ice API boundary on the right, containing the Client Ice core.
- Generated proxy code below and outside the Ice API.
- Bidirectional connections form a compact triangle:
  - Client application ↔ Client Ice core
  - Client application ↔ Generated proxy code
  - Generated proxy code ↔ Client Ice core

## Server process

Mirror the client composition around the network connection, with the Server Ice core on the left and Server application on the right.

- The Ice API contains the Server Ice core and Object adapter.
- Generated skeleton code sits below and outside the Ice API.
- Bidirectional connections are:
  - Server Ice core ↔ Server application
  - Server Ice core ↔ Generated skeleton code
  - Generated skeleton code ↔ Server application
  - Server Ice core ↔ Object adapter
  - Object adapter ↔ Server application

The Client Ice core and Server Ice core communicate bidirectionally across a connector labeled `Network`.

Use ZeroC blue for the Ice API and primary Ice runtime components. Use the muted violet secondary treatment for generated code. Keep process titles and Ice API titles clear of dashed borders and connectors.

The two-headed connectors summarize real two-way flow: API calls and returns, or RPC requests and replies. They are not generic “uses” relationships. A diagram that needs to show the direction or sequence of individual requests should use separate one-way connectors instead.

Original reference: `public/attachments/3.8/basics/client-server.gif`

Comparison SVG: `diagrams/comparisons/client-server-reinterpretation.svg`
