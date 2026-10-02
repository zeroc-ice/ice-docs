---
title: Well-Known Proxy
---

A proxy with no endpoint or object adapter identifier (`@adapterId` in stringified form) is called a well-known proxy. A
well-known proxy consists of an object identity plus (optionally) proxy options such as -t (for two-way proxies), as
described on [Syntax for Stringified Proxies](../../syntax-for-stringified-proxies). Well-known proxies are a form of
[indirect proxies](../../../../basics/terminology).

For example:

```text
Root       # well-known proxy to Root object (two-way by default)
Root -o    # oneway proxy
```

When you invoke an operation on a well-known proxy, Ice locates the target object as follows:

{% iflang langs="js" %}

Ice for JavaScript does not provide collocation optimization, so the resolution starts at step 2.

{% /iflang %}

1. If [collocation optimization](../../../collocated-invocation-and-dispatch) is enabled (the default), Ice looks up the
   object identity in the [Active Servant Map](../../../dispatch/active-servant-map) (ASM) of all
   [object adapters](../../../dispatch) created by the proxy's communicator. The servant locators and default servants
   registered with these object adapters are not consulted. If the object is found in one of these ASMs, Ice then sends
   requests to this object using collocation optimization. The
   [holding state](../../../dispatch/object-adapter-activation-and-deactivation) of the object adapter is ignored for
   this search and subsequent collocated dispatches to the servant.
2. Otherwise, if Ice does not find this object identity in one of these local ASMs (or collocation optimization is
   disabled), and a [locator](../../../locators) is configured with the communicator:

   1. Ice looks up this object identity in its [locator cache](../../../locators/locator-semantics-for-clients).
   2. If this lookup fails, Ice resolves this object identity using the locator.

3. In case the preceding steps can't locate the target object or endpoints, the invocation fails with
   `NoEndpointException`.

## See Also

- [Locators](../../../locators)
- [Well-Known Objects](../../../../services/icegrid/well-known-objects)
