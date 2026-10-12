---
title: Locator Configuration for a Client
---

An indirect proxy needs a [locator](../locator-semantics-for-clients) to resolve its adapter ID or identity into
endpoints. You give a proxy its locator by configuring a locator proxy, in one of several ways:

- by explicitly configuring an indirect proxy using the `ice_locator` proxy method
- by defining the [name.Locator](../../../property-reference/proxy-properties) property of a proxy that the application
  creates with `propertyToProxy`
- by calling `setDefaultLocator` on a communicator, after which all new proxies use the given locator by default
- by defining the [Ice.Default.Locator](../../../property-reference/ice-default-properties) configuration property,
  which causes all proxies to use the given locator by default

To trace how the Ice runtime resolves indirect proxies, set the following properties:

```config
Ice.Trace.Protocol=1
Ice.Trace.Locator=2
```

See [Ice.Trace.*](../../../property-reference/ice-trace-properties) for more information on these properties.

## See Also

- [Locator Semantics for Clients](../locator-semantics-for-clients)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Proxy Properties](../../../property-reference/proxy-properties)
- [Ice.Trace.*](../../../property-reference/ice-trace-properties)
