---
id: dispatch
title: Dispatch
---

The process of accepting/fulfilling a request and returning a response is called a dispatch.

With Ice, an _object adapter_ is the entry point into dispatches: in order to accept requests from clients, you need an
object adapter.

{% callout type="info" %}

Dispatching requests and returning responses is the primary activity of server applications.

{% /callout %}

An object adapter sits at the boundary between the Ice runtime and the server application code and has two main
responsibilities:

- Accept connections established by clients. The clients establish connections to the endpoint or endpoints (network
  addresses) configured on the object adapter.
- Dispatch incoming requests received from these clients. While these requests are often received over the network
  connections accepted by the object adapter, they can also come from local callers
  ([collocated invocations](../collocated-invocation-and-dispatch)) and from outgoing connections attached to this
  object adapter ([bidirectional callbacks](../bidirectional-connections)).

Each object adapter belongs to exactly one communicator (but a single communicator can have many object adapters). Each
object adapter has a name that distinguishes it from all other object adapters in the same communicator.
