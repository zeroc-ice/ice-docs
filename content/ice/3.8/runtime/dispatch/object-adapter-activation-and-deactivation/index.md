---
title: Object Adapter Activation and Deactivation
sidebarLabel: Activation and Deactivation
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

## Activation

An object adapter that was just created is in the `Holding` state. In this state, the object adapter accepts transport
connections but neither validates them at the Ice level nor reads requests from them, and it discards UDP requests. You
typically add servants to the [Active Servant Map](../active-servant-map) in this state, then call `activate` to move
the object adapter to the `Active` state, in which it reads and dispatches the requests received over the connections it
accepts. For example:

{% language-section name="mapping" /%}

{% callout type="note" %}

The `Holding` and `Active` states apply only to requests received over connections the object adapter accepts. An object
adapter dispatches requests received over
[bidirectional connections](../../connection-management/bidirectional-connections) and
[collocated invocations](../../collocated-invocation-and-dispatch) in either state, so an object adapter with no
endpoints needs no `activate` call.

{% /callout %}

## Deactivation

You usually don't need to deactivate or destroy an object adapter yourself: shutting down the communicator deactivates
its object adapters, and destroying the communicator destroys them. To deactivate or destroy an object adapter while its
communicator keeps running, call one of these methods:

- **`deactivate`** The object adapter stops accepting connections, and closes each connection it accepted once the
  dispatches in progress on this connection have completed and sent their replies; requests that arrive over these
  connections in the meantime are not dispatched. A deactivated object adapter cannot be reactivated. Until destroyed, a
  deactivated object adapter keeps dispatching the requests received over
  [bidirectional connections](../../connection-management/bidirectional-connections) and
  [collocated invocations](../../collocated-invocation-and-dispatch).
- **`destroy`** The object adapter deactivates, waits for the dispatches in progress to complete, removes its servants,
  and stops dispatching the requests received over bidirectional connections. You can then create a new object adapter
  with the same name.

See [ObjectAdapter](api:Ice/ObjectAdapter) in the API reference for more details.

## See Also

- [Collocated Invocation and Dispatch](../../collocated-invocation-and-dispatch)
- [Bidirectional Connections](../../connection-management/bidirectional-connections)
