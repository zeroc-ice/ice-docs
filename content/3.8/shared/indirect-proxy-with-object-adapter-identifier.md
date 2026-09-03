---
id: indirect-proxy-with-object-adapter-identifier
title: Indirect Proxy with Object Adapter Identifier
---

A proxy with an object adapter identifier (`@adapterId` in stringified form) is a form of [indirect proxy](../terminology). Such a proxy consists of an object identity, an object adapter identifier and (optionally) proxy options such as -t (for two-way proxies), as described on [Syntax for Stringified Proxies](../syntax-for-stringified-proxies).

For example:

```
Root@fsadapter      # proxy to Root object hosted by object adapter fsadapter
                    # two-way proxy by default
                    
Root@fsadapter -o   # oneway proxy
```

When you invoke an operation on such an indirect proxy, Ice first *resolves* the object adapter identifier–Ice checks if it corresponds to a local object adapter, or retrieves the endpoints published by this object adapter.

The resolution proceeds as follows:

1. If [collocation optimization](../collocated-invocation-and-dispatch) is enabled (the default), Ice checks if an [object adapter](../dispatch) associated with the same communicator as the proxy has the desired object adapter identifier (set through [ReplicaGroupId](../object-adapter-properties) or [AdapterId](../object-adapter-properties)). If there is such an object adapter, Ice then sends requests to this object adapter using collocation optimization. The [holding state](../object-adapter-activation-and-deactivation) of the object adapters is ignored for this search and subsequent collocated dispatches.
2. Otherwise, if no local object adapters carries the desired object adapter identifier (or collocation optimization is disabled), and a [locator](../locators) is configured with the communicator:

   1. Ice looks up this object adapter identifier in its [locator cache](../locator-semantics-for-clients).
   2. If this lookup fails, Ice resolves this object adapter identifier using the locator.

3. In case the preceding steps can't locate the object adapter, the invocation fails with `NoEndpointException`.

##### See Also

- [Locators](../locators)
- [Well-Known Proxies](../well-known-proxy)
