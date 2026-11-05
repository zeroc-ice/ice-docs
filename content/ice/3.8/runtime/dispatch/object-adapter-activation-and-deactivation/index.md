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

A new object adapter is in the holding state: it accepts connections, but doesn't validate them or read requests from
them, and it discards UDP requests. You typically add servants to the [active servant map](../active-servant-map) in
this state, and then call [`activate`](api:Ice/ObjectAdapter.activate) to make the object adapter read and dispatch
requests. [`hold`](api:Ice/ObjectAdapter.hold) puts the object adapter back in the holding state.

The holding state applies only to the connections the object adapter accepts. An object adapter dispatches the requests
received over [bidirectional connections](../../connection-management/bidirectional-connections) and
[collocated invocations](../../collocated-invocation-and-dispatch) in either state, so an object adapter without
endpoints needs no `activate` call.

## Deactivation

Shutting down a communicator deactivates its object adapters, and destroying the communicator destroys them. To
deactivate or destroy an object adapter while its communicator keeps running, call:

- [`deactivate`](api:Ice/ObjectAdapter.deactivate): the object adapter stops accepting connections, and closes each
  connection it accepted once the dispatches in progress on this connection have completed and sent their replies. It
  doesn't dispatch the requests that arrive over these connections in the meantime. A deactivated object adapter cannot
  be reactivated, but it keeps dispatching the requests received over bidirectional connections and collocated
  invocations until you destroy it.
- [`destroy`](api:Ice/ObjectAdapter.destroy): the object adapter deactivates, waits for the dispatches in progress to
  complete, removes its servants, and stops dispatching the requests received over bidirectional connections. You can
  then create a new object adapter with the same name.

## See Also

- [Collocated Invocation and Dispatch](../../collocated-invocation-and-dispatch)
- [Bidirectional Connections](../../connection-management/bidirectional-connections)
