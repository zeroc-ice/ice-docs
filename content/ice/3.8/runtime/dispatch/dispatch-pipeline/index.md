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

An object adapter dispatches each request through its _dispatch pipeline_, a chain of [dispatchers](../dispatcher-api):

1. The [middleware](../middleware) of the object adapter, in installation order. A middleware usually passes the request
   to the next dispatcher, but can also return a response itself, such as an error.
2. The servant of the target Ice object, which the object adapter looks for:
   1. in the [active servant map](../active-servant-map), with the identity and facet of the request;
   2. then among the [default servants](../default-servants), the one registered for the category of the identity or, if
      there is none, the one registered for the empty category;
   3. then among the servant locators, the one registered for the category of the identity or, if there is none, the one
      registered for the empty category. Don't use servant locators in new applications.

When the object adapter finds no servant, the dispatch fails with `FacetNotExistException` if the active servant map has
a servant for the identity of the request with another [facet](../../facets), and with `ObjectNotExistException`
otherwise.
