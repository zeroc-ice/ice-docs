# Ice protocol state machine

Faithfully restyle `public/attachments/3.8/protocol-messages/Protocol_state_machine.gif` without
changing its states or transitions.

## Composition

Use one vertical state lane:

1. Initial node
2. `inactive *`
3. `active`
4. `graceful close *`
5. `close`
6. Final node

Label the transition from `inactive` to `active` as `validate connection`, and the transition from
`active` to `graceful close` as `close connection`.

Preserve the source's shared left-hand lane from `inactive`, `active`, and `graceful close` into
`close`. Add a small directional marker where each horizontal transition enters the shared lane, and
keep the standard arrowhead where the lane enters `close`. Do not invent a label for these
direct-close transitions.

The asterisk annotation reads: `Only for connection-oriented protocols (TCP, SSL)`.

## Presentation

- Use compact neutral, equal-width state pills with extra height only for the two-line `graceful close`
  state.
- Use conventional solid initial and concentric final nodes.
- Use the standard one-way arrow marker and connector treatment.
- Render the asterisks as superscripts.
- Place transition labels to the right of their vertical connectors and place the footnote beside the
  starred-state region.

Original reference: `public/attachments/3.8/protocol-messages/Protocol_state_machine.gif`

Canonical SVG: `public/attachments/3.8/protocol-messages/protocol-state-machine.svg`
