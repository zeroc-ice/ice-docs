# Callback through Glacier2

Landscape layout with a public network on the left and a private network on the right. A dashed vertical network boundary separates them, and Glacier2 straddles it. Draw a separate client-side firewall boundary immediately to the right of the callback client.

Components, left to right:

- Callback client, `IP: 1.2.3.4`
- Glacier2, straddling the boundary
  - Client endpoints, `IP: 5.6.7.8`
  - Server endpoints, `IP: 10.0.0.1`
- Server, `IP: 10.0.0.2`

Glacier2 is a sectioned service component. Its title occupies the upper compartment; its client and server endpoints occupy equal lower compartments. The endpoint divider aligns with the public/private network boundary.

Use the primary Ice-component blue treatment for Glacier2.

Show four numbered request flows:

1. Client → Glacier2 client endpoints
2. Glacier2 server endpoints → Server
3. Server → Glacier2 server endpoints
4. Glacier2 client endpoints → Client

Steps 1 and 4 use opposite arrowheads on one shared solid lane between the client and Glacier2. Label this lane `Existing connection`; its single-line treatment is essential because the callback reuses the bidirectional connection established in step 1.

Steps 2 and 3 use distinct lanes between Glacier2 and the server because they use two separate connections. Step 2 is the routed invocation and uses a solid connector. Step 3 is the callback and uses a dashed connector. The numbers match the ordered explanation in the documentation. A compact legend defines the solid and dashed treatments.

Below the successful flow, show an unnumbered attempted new connection traveling from the server toward the client. It can cross the public/private network boundary but terminates with a red × at the separate client-side firewall. Label it `New direct connection blocked by client firewall`. This explanatory path reinforces why the callback returns through Glacier2; it is not an additional protocol step from the source image.

Original reference: `public/attachments/3.8/callbacks-through-glacier2/Callback_via_Glacier2.gif`

Published SVG: `public/attachments/3.8/callbacks-through-glacier2/callback-via-glacier2.svg`
