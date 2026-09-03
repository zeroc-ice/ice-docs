---
id: implicit-request-contexts
title: Implicit Request Contexts
---

# Using Implicit Request Contexts

In addition to [explicit](../explicit-request-contexts) and [per-proxy](../per-proxy-request-contexts) request contexts, you can also establish an implicit context on a communicator. This implicit context is sent with all invocations made via proxies created by that communicator, provided that you do not supply an explicit context with the call.

# Scope of the Implicit Context

You establish the implicit context on a communicator by setting a property, `Ice.ImplicitContext`. This property controls whether a communicator has an implicit context and, if so, at what scope the context applies. The property can be set to the following values:

- `None`
   With this setting (or if `Ice.ImplicitContext` is not set at all), the communicator has no implicit context, and `getImplicitContext` on the communicator returns null.

- `Shared`
   The communicator has a single implicit context that is shared by all threads. Access to the context via its `ImplicitContext` class is interlocked, so different threads can concurrently manipulate the context without risking data corruption or reading stale values.

- `PerThread`
   The communicator maintains a separate implicit context for each thread. This allows you to propagate contexts that depend on the sending thread (for example, to send per-thread transaction IDs).

##### See Also

- [Explicit Request Contexts](../explicit-request-contexts)
- [Per-Proxy Request Contexts](../per-proxy-request-contexts)
