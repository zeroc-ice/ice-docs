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
  - using-multiple-object-adapters
---

A _dispatch_ is the processing of a request on the server side: Ice runs the code that implements the operation, and
returns the response to the caller.

An _object adapter_ is the entry point for dispatches.

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter accepts the connections that clients establish to its [endpoints](./object-adapter-endpoints), and
dispatches the requests it receives over these connections, from
[collocated invocations](../collocated-invocation-and-dispatch), and over the
[bidirectional connections](../connection-management/bidirectional-connections) associated with it.

{% /iflang %}

{% iflang langs="js" %}

An object adapter dispatches the requests it receives over the
[bidirectional connections](../connection-management/bidirectional-connections) associated with it.

{% /iflang %}

Each object adapter belongs to a communicator, which can have several object adapters, and has a name unique within this
communicator.
