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

A new object adapter does not read requests from the connections that clients establish to its endpoints. You typically
add servants to the [active servant map](../active-servant-map) first, and then call
[`activate`](api:Ice/ObjectAdapter.activate) to make the object adapter read and dispatch these requests.

Activation concerns only the connections that the object adapter accepts. An object adapter dispatches the requests it
receives over [bidirectional connections](../../connection-management/bidirectional-connections) and from
[collocated invocations](../../collocated-invocation-and-dispatch) whether or not you activate it, so an object adapter
without endpoints needs no `activate` call.

## Deactivation

Shutting down a communicator deactivates its object adapters, and destroying the communicator destroys them. To
deactivate or destroy an object adapter while its communicator keeps running, call:

- [`deactivate`](api:Ice/ObjectAdapter.deactivate) starts the deactivation of the object adapter and returns without
  waiting for the dispatches in progress. The object adapter stops accepting connections, and closes each connection it
  accepted once the dispatches in progress on this connection have completed and sent their replies. It doesn't dispatch
  the requests that arrive over these connections in the meantime. A deactivated object adapter cannot be reactivated,
  but it keeps dispatching the requests received over bidirectional connections and collocated invocations until you
  destroy it.
- [`destroy`](api:Ice/ObjectAdapter.destroy) deactivates the object adapter and returns once its destruction is
  complete. The object adapter waits for the dispatches in progress to complete, removes its servants, and stops
  accepting requests from bidirectional connections. You can then create a new object adapter with the same name.

## See Also

- [Collocated Invocation and Dispatch](../../collocated-invocation-and-dispatch)
- [Bidirectional Connections](../../connection-management/bidirectional-connections)
