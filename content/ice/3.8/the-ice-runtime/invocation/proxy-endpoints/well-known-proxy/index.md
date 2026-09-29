---
title: Well-Known Proxy
---

A proxy with no endpoint or object adapter identifier (`@adapterId` in stringified form) is called a well-known proxy. A
well-known proxy consists of an object identity plus (optionally) proxy options such as -t (for two-way proxies), as
described on [Syntax for Stringified Proxies](../syntax-for-stringified-proxies). Well-known proxies are a form of
[indirect proxies](../terminology).

For example:

```text
Root       # well-known proxy to Root object (two-way by default)
Root -o    # oneway proxy
```

When you invoke an operation on a well-known proxy, Ice locates the target object as follows:

1. If [collocation optimization](../collocated-invocation-and-dispatch) is enabled (the default), Ice looks up the
   object identity in the [Active Servant Map](../the-active-servant-map) (ASM) of all [object adapters](../dispatch)
   associated with the same communicator as this well-known proxy. The servant locators and default servants registered
   with these object adapters are not consulted. If the object is found in one of these ASMs, Ice then sends requests to
   this object using collocation optimization. The [holding state](../object-adapter-activation-and-deactivation) of the
   object adapter is ignored for this search and subsequent collocated dispatches to the servant.
2. Otherwise, if Ice does not find this object identity in one of these local ASMs (or collocation optimization is
   disabled), and a [locator](../locators) is configured with the communicator:

   1. Ice looks up this object identity in its [locator cache](../locator-semantics-for-clients).
   2. If this lookup fails, Ice resolves this object identity using the locator.

3. In case the preceding steps can't locate the target object or endpoints, the invocation fails with
   `NoEndpointException`.

##### See Also

- [Locators](../locators)
- [Well-Known Objects](../well-known-objects)
