---
title: Request Contexts
pages:
  - explicit-request-contexts
  - per-proxy-request-contexts
  - implicit-request-contexts
---

A _request context_ is a dictionary of string keys and values that Ice sends with an invocation. It lets a client send
additional information with a request without adding a parameter to the operation. The implementation of the operation
reads the context from the `ctx` field of its `Current` parameter.

{% iflang langs="cpp,csharp,java,js,swift" %}

A [middleware](../../dispatch/middleware) is a typical consumer of request contexts: it sees every request the object
adapter dispatches and reads the context through the `current` of the incoming request.

{% /iflang %}

A client supplies a context in the following ways:

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

- An [explicit context](./explicit-request-contexts) applies to one invocation.
- A [per-proxy context](./per-proxy-request-contexts) applies to the invocations made through a proxy.
- An [implicit context](./implicit-request-contexts) applies to the invocations made through the proxies of a
  communicator.

{% /iflang %}

{% iflang langs="php" %}

- An [explicit context](./explicit-request-contexts) applies to one invocation.
- A [per-proxy context](./per-proxy-request-contexts) applies to the invocations made through a proxy.

{% /iflang %}

Context keys that begin with an underscore are reserved for Ice.

## Combining Request Contexts

An explicit context, even an empty one, replaces the other contexts: Ice sends only the explicit context with the
invocation.

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

Without an explicit context, Ice sends the entries of both the per-proxy and the implicit contexts. When both contain
the same key, Ice sends the value of the per-proxy context.

{% /iflang %}
