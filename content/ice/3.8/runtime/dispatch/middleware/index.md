---
title: Middleware
languages:
  - cpp
  - csharp
  - java
  - js
  - swift
---

A _middleware_ is a [dispatcher](../dispatcher-api) that intercepts the requests of an object adapter before they reach
the servant, and their responses before Ice sends them. A middleware holds the next dispatcher of the
[dispatch pipeline](../dispatch-pipeline): its dispatch method can run code before and after calling this next
dispatcher, or return a response itself, such as an error, without calling it.

## Installing a Middleware

[`use`](api:Ice/ObjectAdapter.use) installs a middleware on an object adapter. It takes a factory that creates the
middleware from the next dispatcher, and the object adapter calls this factory when it dispatches its first request. You
install all the middleware of an object adapter before this first dispatch, and they intercept requests in the order you
install them.

For example, the following middleware checks a token before passing the request on, and the call to `use` installs it:

{% language-section name="mapping" /%}

## Built-in Middleware

Ice installs the following middleware at the beginning of the dispatch pipeline:

- the logger middleware, unless both `Ice.Warn.Dispatch` and `Ice.Trace.Dispatch` are set to `0`.
- the observer middleware, when the [Metrics admin facet](../../../administration/administrative-facility/metrics-facet)
  is enabled.
