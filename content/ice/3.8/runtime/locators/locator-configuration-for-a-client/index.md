---
title: Locator Configuration for a Client
---

An Ice client application must supply a proxy for the [locator](../locator-semantics-for-clients) object, which it can
do in several ways:

- by explicitly configuring an indirect proxy using the `ice_locator` proxy method
- by defining the [name.Locator](../../../property-reference/proxy-properties) property of a proxy that the application
  creates with `propertyToProxy`
- by calling `setDefaultLocator` on a communicator, after which all new proxies use the given locator by default
- by defining the [Ice.Default.Locator](../../../property-reference/ice-default-properties) configuration property,
  which causes all proxies to use the given locator by default

The communicator's efforts to resolve an indirect proxy can be traced by setting the following configuration properties:

```config
Ice.Trace.Network=2
Ice.Trace.Protocol=1
Ice.Trace.Locator=2
```

See [Ice.Trace.*](../../../property-reference/ice-trace-properties) for more information on these properties.

## See Also

- [Locator Semantics for Clients](../locator-semantics-for-clients)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Proxy Properties](../../../property-reference/proxy-properties)
- [Ice.Trace.*](../../../property-reference/ice-trace-properties)
