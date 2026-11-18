---
title: The Dispatch Pipeline
sidebarLabel: Dispatch Pipeline
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

An object adapter dispatches each incoming request through its _dispatch pipeline_, a chain of
[dispatchers](../dispatcher-api).

The request first goes through the [middleware](../middleware) of the object adapter, in installation order. A
middleware usually passes the request to the next dispatcher, but can also return a response itself, such as an error.

Once the request has gone through all the middleware, the object adapter dispatches the request to a servant. It looks
for this servant in the following order:

1. The servant in its [active servant map](../active-servant-map) (ASM) for the identity and facet of the request.
2. The [default servant](../default-servants) registered for the category of the identity.
3. The default servant registered for the empty category.
4. A servant provided by a servant locator. Don't use servant locators in new applications.

When the object adapter finds no servant, the dispatch fails with `FacetNotExistException` if the ASM has a servant for
the identity of the request with another [facet](../../facets), and with `ObjectNotExistException` otherwise.
