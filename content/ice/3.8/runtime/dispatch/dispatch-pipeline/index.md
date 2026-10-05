---
title: The Dispatch Pipeline
---

An object adapter dispatches incoming requests using its dispatch pipeline. A dispatch pipeline implements the
[Dispatcher](../../../basics/terminology) abstraction using a tree-like structure of dispatchers.

The leaves of this tree are servants, while intermediary nodes in this tree are middleware and an internal helper class,
`ServantManager`.

{% callout type="note" %}

Servants, middleware, and even the internal `ServantManager` class, all implement the Dispatcher abstraction.

{% /callout %}

## Dispatch Pipeline Decision Tree

An object adapter gives all incoming requests to its dispatch pipeline, which performs the following steps:

- Traverse the [middleware](../middleware) installed on this object adapter. A middleware can occasionally fulfill the
  request itself by returning a cached response, or more commonly, by returning an error.
- Look for the identity and facet carried by the request in the [Active Servant Map](../active-servant-map) (ASM). If
  the ASM contains an entry, dispatch the request to the corresponding servant. (End of tree).
- Look for a [default servant](../default-servants) registered for the category component of the identity carried by the
  request. If found, dispatch the request to this servant. (End of tree).
- Look for a default servant registered with the empty category. If found, dispatch the request to this servant. (End of
  tree).
- Look for a servant locator that provides a servant. We only mention servant locators for completeness, as you should
  not use servant locators in new applications.
- If none of the previous steps found a servant:
  - throw `FacetNotExistException` when the ASM contains a servant with a matching identity, but a non-matching
    [facet](../../facets)
  - otherwise, throw `ObjectNotExistException`

As far as the dispatch pipeline is concerned, servants are just dispatchers – they accept requests and return responses.
The dispatch pipeline does not rely on APIs provided by servants beyond the [Dispatcher API](../dispatcher-api).
