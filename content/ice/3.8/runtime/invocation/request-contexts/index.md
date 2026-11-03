---
title: Request Contexts
pages:
  - explicit-request-contexts
  - per-proxy-request-contexts
  - implicit-request-contexts
---

A _request context_ is a dictionary of string keys and values that Ice sends with an invocation. It lets a client send
metadata with a request without adding a parameter to the operation. The implementation of the operation reads the
context from the `ctx` field of its `Current` parameter.

Context keys that begin with an underscore are reserved for Ice.

A client supplies a context in one of the following ways:

- An [explicit context](./explicit-request-contexts) applies to one invocation.
- A [per-proxy context](./per-proxy-request-contexts) applies to the invocations made through a proxy.

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

- An [implicit context](./implicit-request-contexts) applies to the invocations made through the proxies of a
  communicator.

{% /iflang %}

## Combining Request Contexts

An explicit context, even an empty one, replaces the other contexts: Ice sends only the explicit context with the
invocation.

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

Without an explicit context, Ice sends the entries of both the per-proxy and the implicit contexts. When both contain
the same key, Ice sends the value of the per-proxy context.

{% /iflang %}

## When to Use Request Contexts

Use a request context for information that applies to requests in general rather than to one operation, such as a
transaction identifier, an authorization token, or a language preference. Data that belongs to a specific operation,
including an argument added in a later version, goes in the operation's parameters, where it is strongly typed;
[optional parameters](../../../slice/operations#optional-parameters-and-return-values) let you add one without breaking
existing clients.

A router decides what happens to the context of each request it forwards: it can pass the context on, change it, or drop
it. Glacier2 drops it unless you
[configure it to forward contexts](../../../services/glacier2/how-glacier2-uses-request-contexts#context-forwarding).
