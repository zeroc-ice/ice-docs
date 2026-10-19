---
title: Indirect Proxy with Adapter ID
sidebarLabel: Adapter ID Proxy
---

A proxy with an adapter ID (`@adapterId` in stringified form) is a form of
[indirect proxy](../../../../basics/terminology). Such a proxy consists of an object identity, an adapter ID and
(optionally) proxy options such as -t (for two-way proxies), as described on
[Syntax for Stringified Proxies](../../syntax-for-stringified-proxies).

For example:

```text
Root@fsadapter      # proxy to Root object hosted by object adapter fsadapter
                    # two-way proxy by default

Root -o @ fsadapter # oneway proxy
```

When you invoke an operation on such an indirect proxy, Ice first _resolves_ the adapter ID–Ice checks if it corresponds
to a local object adapter, or retrieves the endpoints published by this object adapter.

The resolution proceeds as follows:

{% iflang langs="js" %}

Ice for JavaScript does not provide collocation optimization, so the resolution starts at step 2.

{% /iflang %}

1. If [collocation optimization](../../../collocated-invocation-and-dispatch) is enabled (the default), Ice checks if an
   [object adapter](../../../dispatch) created by the proxy's communicator has the desired adapter ID (set through
   [ReplicaGroupId](../../../../property-reference/object-adapter-properties) or
   [AdapterId](../../../../property-reference/object-adapter-properties)). If there is such an object adapter, Ice then
   sends requests to this object adapter using collocation optimization. The
   [holding state](../../../dispatch/object-adapter-activation-and-deactivation) of the object adapters is ignored for
   this search and subsequent collocated dispatches.
2. Otherwise, if no local object adapter carries the desired adapter ID (or collocation optimization is disabled), and a
   [locator](../../../locators) is configured with the communicator:

   1. Ice looks up this adapter ID in its [locator cache](../../../locators/locator-semantics-for-clients).
   2. If this lookup fails, Ice resolves this adapter ID using the locator.

3. In case the preceding steps can't locate the object adapter, the invocation fails with `NoEndpointException`.

## See Also

- [Locators](../../../locators)
- [Well-Known Proxies](../well-known-proxy)
