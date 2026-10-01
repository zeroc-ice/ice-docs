---
title: Ice.Default.*
---

{% language-section name="lang-1" /%}

## Ice.Default.EncodingVersion

### Synopsis {% id="ice.default.encodingversion-synopsis" %}

`Ice.Default.EncodingVersion=ver`

### Description {% id="ice.default.encodingversion-description" %}

If this property is not defined, Ice uses encoding version 1.1 when parsing a string that represents a proxy if this
string does not specify an encoding with the `-e` option. To use encoding version 1.0 as the default instead, set this
property to `1.0`:

`Ice.Default.EncodingVersion=1.0`

## Ice.Default.EndpointSelection

### Synopsis {% id="ice.default.endpointselection-synopsis" %}

`Ice.Default.EndpointSelection=policy`

### Description {% id="ice.default.endpointselection-description" %}

This property controls the default [endpoint selection](../connection-establishment) policy for proxies with multiple
endpoints. Permissible values are `Ordered` and `Random`. The default value of this property is `Random`.

## Ice.Default.Host

### Synopsis {% id="ice.default.host-synopsis" %}

`Ice.Default.Host=host`

### Description {% id="ice.default.host-description" %}

If an endpoint does not specify a host name (i.e., omits the `-h host` option in IP-based endpoints or the `-a address`
option in a Bluetooth endpoint), the `host` value from this property is used instead. This property applies to both
[client and server endpoints](../endpoint-syntax). It has no default value.

## Ice.Default.InvocationTimeout

### Synopsis {% id="ice.default.invocationtimeout-synopsis" %}

`Ice.Default.InvocationTimeout=num`

### Description {% id="ice.default.invocationtimeout-description" %}

Specifies the default [invocation timeout](../invocation-timeouts) in milliseconds to use for all proxies. If not
defined, the default timeout is `-1`, which means an invocation never times out.

## Ice.Default.Locator

### Synopsis {% id="ice.default.locator-synopsis" %}

`Ice.Default.Locator=locator`

### Description {% id="ice.default.locator-description" %}

Specifies a default [locator](../locators) for all proxies and object adapters. The value is a stringified proxy for the
[IceGrid](../icegrid) locator object. The default locator can be overridden on a proxy using the `ice_locator`
[proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx). The default value is no locator.

The default identity of the IceGrid locator object is `IceGrid/Locator`, but this identity is influenced by the
[IceGrid.InstanceName](../icegrid-properties) property. The locator object is available on the IceGrid client endpoints.
For example, suppose [IceGrid.Registry.Client.Endpoints](../icegrid-properties) is set as follows:

```config
IceGrid.Registry.Client.Endpoints=tcp -p 12000 -h localhost
```

In this case, the stringified proxy for the IceGrid locator is:

```config
Ice.Default.Locator=IceGrid/Locator:tcp -p 12000 -h localhost
```

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## Ice.Default.LocatorCacheTimeout

### Synopsis {% id="ice.default.locatorcachetimeout-synopsis" %}

`Ice.Default.LocatorCacheTimeout=num`

### Description {% id="ice.default.locatorcachetimeout-description" %}

Specifies the default [locator cache](../locator-semantics-for-clients) timeout for indirect proxies, in seconds. If
`num` is set to a value larger than 0, locator cache entries older than `num` seconds are ignored. If set to 0, the
locator cache is not used. If set to `-1`, locator cache entries do not expire.

Once a cache entry has expired, the Ice runtime performs a new locate request to refresh the cache before sending the
next invocation; therefore, the invocation is delayed until the runtime has refreshed the entry. If you set
[Ice.BackgroundLocatorCacheUpdates](../ice-properties) to a non-0value, the lookup to refresh the cache is still
performed but happens in the background; this avoids the delay for the first invocation that follows expiry of a cache
entry.

{% language-section name="lang-2" /%}

## Ice.Default.Protocol

### Synopsis {% id="ice.default.protocol-synopsis" %}

`Ice.Default.Protocol=transport protocol`

### Description {% id="ice.default.protocol-description" %}

Sets the [transport protocol](../endpoint-syntax) that is being used if an endpoint uses `default` as the transport
protocol specification. The default value is `tcp`.

## Ice.Default.Router

### Synopsis {% id="ice.default.router-synopsis" %}

`Ice.Default.Router=router`

### Description {% id="ice.default.router-description" %}

Specifies the default [router](../routers) for all proxies. The value is a stringified proxy for the Glacier2 router
control interface. The default router can be overridden on a proxy using the `ice_router`
[proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx). The default value is no router. This property is only for
proxies: it does not add a router to object adapters.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## Ice.Default.SlicedFormat

### Synopsis {% id="ice.default.slicedformat-synopsis" %}

`Ice.Default.SlicedFormat=num`

### Description {% id="ice.default.slicedformat-description" %}

Specifies the encoding format of Slice classes and exceptions. The default value of `num` is 0, meaning that the
encoding uses the compact format. Set this property to a non-0 value to use the sliced format by default. This setting
is only relevant when using version 1.1 of the Ice encoding.

Note that you can also specify whether certain operations use the sliced format by annotating their definitions with
[metadata](../slice-metadata-directives).

## Ice.Default.SourceAddress

### Synopsis {% id="ice.default.sourceaddress-synopsis" %}

`Ice.Default.SourceAddress=addr`

### Description {% id="ice.default.sourceaddress-description" %}

If specified, outgoing socket connections will be bound using the given address `addr`. This allows to set a specific IP
address as the source address of IP packets but it doesn't necessarily imply that the operating system will use the
network interface matching this IP address to send out the IP packet. It must be set to a numeric IP address. Proxy
endpoints can override this setting with the [--sourceAddress](../endpoint-syntax) option. If no source address is
configured, the Ice runtime uses the operating system's default behavior for binding an outgoing socket connection.
