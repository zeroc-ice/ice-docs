---
title: Dispatcher API
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

A _dispatcher_ accepts an incoming request and returns an outgoing response. Servants, [middleware](../middleware) and
the [dispatch pipeline](../dispatch-pipeline) of an object adapter are dispatchers.

{% language-section name="dispatcher" /%}

## Servants

A _servant_ is a dispatcher that handles requests itself, rather than passing them to another dispatcher. A servant
usually implements a skeleton that the Slice compiler generates for a Slice interface. The skeleton dispatches each
request: it unmarshals the parameters, calls the method you implement for the operation, and marshals the return value
and out parameters into the response. It also implements the operations of
[Object](../../../slice/operations-on-object): `ice_id`, `ice_ids`, `ice_isA` and `ice_ping`.

{% iflang langs="cpp,csharp,java,js,swift" %}

A servant can also implement the dispatch method itself, without a generated skeleton: it reads the parameters from the
request's input stream and writes its results to an output stream.
[Input and Output Streams](../../input-and-output-streams) shows how to read and write Slice types with these streams.
You add such a servant to an object adapter like any other servant, in its [active servant map](../active-servant-map)
or as a [default servant](../default-servants).

{% /iflang %}
