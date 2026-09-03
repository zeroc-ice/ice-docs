# SVG pilot review material

These comparison files support review of the direct-SVG pilot. The canonical SVGs live beside the
documentation assets under `public/attachments/`; the files in this directory are not published by
the documentation site.

## Local review pages

Start the documentation server on port 3101, then open:

| Figure                      | Local page                                                                   |
| --------------------------- | ---------------------------------------------------------------------------- |
| Client and server structure | <http://localhost:3101/ice/3.8/cpp/basics>                                   |
| Callback through Glacier2   | <http://localhost:3101/ice/3.8/cpp/callbacks-through-glacier2>               |
| Interface inheritance       | <http://localhost:3101/ice/3.8/cpp/interface-inheritance>                    |
| Protocol state machine      | <http://localhost:3101/ice/3.8/cpp/protocol-messages#protocol-state-machine> |
| Slice compilation           | <http://localhost:3101/ice/3.8/cpp/slice-compilation>                        |

## Rendered-page screenshots

The screenshots below were captured from the local server at a 1440-pixel viewport. They show the
new SVG in its documentation context, including the available content-column width and caption.

- [Client and server structure](screenshots/client-server-page.png)
- [Callback through Glacier2](screenshots/callback-via-glacier2-page.png)
- [Interface inheritance](screenshots/radioclock-page.png)
- [Protocol state machine](screenshots/protocol-state-machine-page.png)
- [Slice compilation](screenshots/slice-compilation-page.png)

## Original and replacement

### Client and server structure

| Original GIF                                                                                   | Direct SVG                                                                                |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![Original client and server structure](../../public/attachments/3.8/basics/client-server.gif) | ![New client and server structure](../../public/attachments/3.8/basics/client-server.svg) |

### Callback through Glacier2

| Original GIF                                                                                                          | Direct SVG                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ![Original Glacier2 callback flow](../../public/attachments/3.8/callbacks-through-glacier2/Callback_via_Glacier2.gif) | ![New Glacier2 callback flow](../../public/attachments/3.8/callbacks-through-glacier2/callback-via-glacier2.svg) |

### Interface inheritance

| Original GIF                                                                                                  | Direct SVG                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ![Original RadioClock inheritance diagram](../../public/attachments/3.8/interface-inheritance/radioclock.gif) | ![New RadioClock inheritance diagram](../../public/attachments/3.8/interface-inheritance/radioclock.svg) |

### Protocol state machine

| Original GIF                                                                                                  | Direct SVG                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ![Original protocol state machine](../../public/attachments/3.8/protocol-messages/Protocol_state_machine.gif) | ![New protocol state machine](../../public/attachments/3.8/protocol-messages/protocol-state-machine.svg) |

### Slice compilation

| Original GIF                                                                                                | Direct SVG                                                                                             |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| ![Original Slice compilation diagram](../../public/attachments/3.8/slice-compilation/slice-compilation.gif) | ![New Slice compilation diagram](../../public/attachments/3.8/slice-compilation/slice-compilation.svg) |

## Client and server design comparisons

The selected three-layer diagram is the published SVG. The additional SVG in this directory records
the containment-based alternative considered during the pilot.
