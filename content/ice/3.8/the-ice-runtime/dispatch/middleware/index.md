---
title: Middleware
---

# Intercepting Incoming Requests

A middleware is a piece of code that intercepts an incoming request before this request reaches the target servant. The
same code also intercepts the outgoing response before it's sent back to the caller.

At a more technical level, a middleware is a dispatcher that holds another dispatcher ("next") and calls `dispatch` on
this next dispatcher as part of the implementation of its own `dispatch` method.

A middleware can include logic before calling `dispatch` on the next dispatcher (before the request is processed) and
after calling `dispatch` on the next dispatcher (after it receives the response). A middleware can also short-circuit
the dispatch processing by returning a cached response or by returning an error.

# Middleware API

{% language-section name="lang-1" /%}

## Built-in Middleware

Ice installs automatically the following middleware at the beginning of the dispatch pipeline:

- the logger middleware, unless both `Ice.Warning.Dispatch` and `Ice.Trace.Dispatch` are set to `0`.
- the observer middleware, when the [Metrics admin facet](../the-metrics-facet) is enabled.
