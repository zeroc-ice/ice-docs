---
title: Design Considerations for Request Contexts
sidebarLabel: Design Considerations
---

## Request Context Interactions

If you use [explicit](../explicit-request-contexts), [per-proxy](../per-proxy-request-contexts), and
[implicit](../implicit-request-contexts) contexts, it is important to be aware of their interactions:

- If you send an explicit context with an invocation, _only_ that context is sent with the call, regardless of whether
  the proxy has a per-proxy context and whether the communicator has an implicit context.
- If you send an invocation via a proxy that has a per-proxy context, and the communicator also has an implicit context,
  the contents of the per-proxy and implicit context dictionaries are combined, so the _combination_ of context entries
  of both contexts is transmitted to the server. If the per-proxy context and the implicit context contain the same key,
  but with different values, the _per-proxy_ value takes precedence.

## Request Context Use Cases

The purpose of request contexts is to permit services to be added to Ice that require some contextual information with
every request. Contextual information can be used by services such as a transaction service (to provide the context of a
currently established transaction) or a security service (to provide an authorization token to the server).
[IceStorm](../../../../services/icestorm) uses the context to provide an optional `cost` parameter to the service that
influences how the service propagates events to downstream subscribers, and [Glacier2](../../../../services/glacier2)
uses the context to influence request routing.

In general, services that require such contextual information can be implemented much more elegantly using contexts
because this hides explicit Slice parameters that would otherwise have to be supplied by the application programmer with
every call. For a request-forwarding intermediary service such as IceStorm or Glacier2, using a parameter is not an
option because the service does not know the signatures of the requests that it is forwarding, but the service does have
access to the context. For this use case, the context is a convenient way for the caller to annotate a request.

In addition, contexts, because they are optional, permit a single Slice definition to apply to implementations that use
the context, as well as to implementations that do not use it. In this way, to add transactional semantics to an
existing service, you do not need to modify the Slice definitions to add an extra parameter to each operation. (Adding
an extra parameter would not only be inconvenient for clients, but would also split the type system into two halves:
without contexts, we would need different Slice definitions for transactional and non-transactional implementations of
(conceptually) a single service.)

Finally, per-proxy contexts permit context information to be passed through intermediate parts of your program without
cooperation of those intermediate parts. For example, suppose you set a per-proxy context on a proxy and then pass that
proxy to another function. When that function uses the proxy to invoke an operation, the per-proxy context will still be
sent. In other words, per-proxy contexts allow you to transparently propagate information via intermediaries that are
ignorant of the presence of any context.

Keep in mind though that this works only within a single process. If you stringify a proxy or transmit it as a parameter
over the wire, the per-proxy context is _not_ preserved. (Ice does not write the per-proxy context into stringified
proxies and does not marshal the per-proxy context when a proxy is marshaled.)

## Recommendations for Request Contexts

Use a request context for information that applies to requests in general rather than to one operation, such as a
transaction identifier, an authorization token, or a language preference. Data that belongs to a specific operation,
including an argument added in a later version, goes in the operation's parameters, where it is strongly typed;
[optional parameters](../../../../slice/operations#optional-parameters-and-return-values) let you add one without
breaking existing clients.

A router decides what happens to the context of each request it forwards: it can pass the context on, change it, or drop
it. Glacier2 drops it unless you
[configure it to forward contexts](../../../../services/glacier2/how-glacier2-uses-request-contexts#context-forwarding).
