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
its object adapters, and destroying the communicator destroys them.

To stop an object adapter before then, call `destroy`. It stops accepting connections, closes the connections the object
adapter accepted, waits for the requests being dispatched to complete, and removes the object adapter's servants. You
can then create a new object adapter with the same name. See [ObjectAdapter](api:Ice/ObjectAdapter) in the API reference
for more details.

## See Also

- [Collocated Invocation and Dispatch](../../collocated-invocation-and-dispatch)
- [Bidirectional Connections](../../connection-management/bidirectional-connections)
