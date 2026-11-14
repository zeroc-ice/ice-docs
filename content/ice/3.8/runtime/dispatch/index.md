---
title: Dispatch
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
pages:
  - creating-an-object-adapter
  - object-adapter-activation-and-deactivation
  - object-adapter-endpoints
  - dispatch-pipeline
  - dispatcher-api
  - active-servant-map
  - default-servants
  - middleware
---

A _dispatch_ is the server-side processing of a request.

{% iflang langs="cpp,csharp,java,python,swift" %}

In Ice, only an _object adapter_ can accept connections and dispatch requests. An object adapter dispatches the requests
it receives from:

- The connections that it accepts on its [endpoints](./object-adapter-endpoints).
- [Collocated invocations](../collocated-invocation-and-dispatch), which use no connection.
- [Bidirectional connections](../connection-management/bidirectional-connections), the outgoing connections associated
  with it. Create an object adapter without endpoints for this purpose.

{% /iflang %}

{% iflang langs="js" %}

An _object adapter_ dispatches the requests it receives over the
[bidirectional connections](../connection-management/bidirectional-connections) associated with it.

{% /iflang %}

A communicator can have several object adapters. The name of an object adapter is the prefix of the
[properties](../../property-reference/object-adapter-properties) that configure it, so choose a name that is easy to
type. A non-empty name is unique within its communicator.
