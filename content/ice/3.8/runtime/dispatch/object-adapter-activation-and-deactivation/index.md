---
title: Object Adapter Activation and Deactivation
sidebarLabel: Activation and Deactivation
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

## Activation

An object adapter that was just created is in the `Holding` state. In this state, transport connections are accepted
(the object adapter “listens” on the network), however, connections are not validated at the Ice level and incoming
requests are not read off the network. UDP requests are silently discarded in the `Holding` state.

This should be a very temporary state for your object adapter, during which you typically add a few servants to the
[Active Servant Map](../active-servant-map).

You transition your object adapter from the `Holding` state to the `Active` state by calling `activate`. For example:

{% language-section name="mapping" /%}

Once activated, the object adapter accepts incoming connections, and reads and dispatches incoming requests received
over these connections.

{% callout type="note" %}

The distinction between `Holding` and `Active` applies only to requests dispatched through endpoints configured on the
object adapter. It does not apply to requests received from
[bidirectional connections](../../connection-management/bidirectional-connections), nor does it apply to
[collocated dispatches](../../collocated-invocation-and-dispatch).

As a result, it’s optional to call `activate` on an object adapter that does not have any endpoint.

{% /callout %}

## Deactivation

While you need to activate an object adapter that listens on one or more endpoints, you usually don’t need to deactivate
or destroy this object adapter explicitly: the shutdown and destruction of the communicator you used to create this
object adapter will deactivate and destroy this object adapter for you.

Nevertheless, in some cases, you may want to deactivate and destroy an object adapter explicitly using the following
methods:

- `deactivate` The `deactivate` method initiates deactivation of the adapter: the adapter stops accepting connections
  and closes the connections it accepted. Requests that arrive over these connections after calling `deactivate` are not
  dispatched, but currently executing requests are allowed to complete. Once all requests have completed, the adapter
  enters the `Inactive` state. `deactivate` does not wait for the currently executing requests to complete. A
  deactivated adapter cannot be reactivated: calling `activate` throws `ObjectAdapterDeactivatedException`. You can
  create a new adapter with the same name, but only after calling `destroy` on the existing adapter. Until you destroy
  it, a deactivated adapter keeps dispatching requests received over
  [bidirectional connections](../../connection-management/bidirectional-connections) and
  [collocated invocations](../../collocated-invocation-and-dispatch).
- `waitForDeactivate` The `waitForDeactivate` method suspends the calling thread until the adapter has completed its
  transition to the `Inactive` state, that is, until all currently executing requests have completed.
- `destroy` The `destroy` method deactivates the adapter and releases all of its resources. Internally, `destroy`
  invokes `deactivate` followed by `waitForDeactivate`, therefore the method blocks until all currently executing
  requests have completed. Furthermore, the adapter removes all its servants, all transport endpoints are closed, and
  the adapter's name becomes available for reuse. Creating a proxy with a destroyed adapter throws
  `ObjectAdapterDestroyedException`.

## See Also

- [Collocated Invocation and Dispatch](../../collocated-invocation-and-dispatch)
- [Bidirectional Connections](../../connection-management/bidirectional-connections)
