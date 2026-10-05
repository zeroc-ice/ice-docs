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

This property controls the default [endpoint selection](../../runtime/connection-management/connection-establishment)
policy for proxies with multiple endpoints. Permissible values are `Ordered` and `Random`. The default value of this
property is `Random`.

## Ice.Default.Host

### Synopsis {% id="ice.default.host-synopsis" %}

`Ice.Default.Host=host`

### Description {% id="ice.default.host-description" %}

If an endpoint does not specify a host name (i.e., omits the `-h host` option in IP-based endpoints or the `-a address`
option in a Bluetooth endpoint), the `host` value from this property is used instead. This property applies to both
[client and server endpoints](../../runtime/endpoint-syntax). It has no default value.

## Ice.Default.InvocationTimeout

### Synopsis {% id="ice.default.invocationtimeout-synopsis" %}

`Ice.Default.InvocationTimeout=num`

### Description {% id="ice.default.invocationtimeout-description" %}

Specifies the default [invocation timeout](../../runtime/invocation/invocation-timeouts) in milliseconds to use for all
proxies. The default value is `-1`, which disables the timeout.

## Ice.Default.Locator

### Synopsis {% id="ice.default.locator-synopsis" %}

`Ice.Default.Locator=locator`

### Description {% id="ice.default.locator-description" %}

Specifies a default [locator](../../runtime/locators) for all proxies and object adapters. The value is a stringified
proxy for the [IceGrid](../../services/icegrid) locator object. The default locator can be overridden on a proxy using
the `ice_locator` [proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx). The default value is no locator.

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

Specifies the default [locator cache](../../runtime/locators/locator-semantics-for-clients) timeout for indirect
proxies, in seconds. If `num` is greater than `0`, locator cache entries older than `num` seconds are ignored. If set to
`0`, the locator cache is not used. The default value, `-1`, means cache entries do not expire.

Once a cache entry has expired, the Ice runtime performs a new locate request to refresh the cache before sending the
next invocation; therefore, the invocation is delayed until the runtime has refreshed the entry. If you set
[Ice.BackgroundLocatorCacheUpdates](../ice-properties) to a non-zero value, the lookup to refresh the cache is still
performed but happens in the background; this avoids the delay for the first invocation that follows expiry of a cache
entry.

{% language-section name="lang-2" /%}

## Ice.Default.Protocol

### Synopsis {% id="ice.default.protocol-synopsis" %}

`Ice.Default.Protocol=transport protocol`

### Description {% id="ice.default.protocol-description" %}

Sets the [transport protocol](../../runtime/endpoint-syntax) that is being used if an endpoint uses `default` as the
transport protocol specification.

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

The default value is `tcp`.

{% /iflang %}

{% iflang langs="js" %}

The default value is `ws` in a browser and `tcp` in Node.js.

{% /iflang %}

## Ice.Default.Router

### Synopsis {% id="ice.default.router-synopsis" %}

`Ice.Default.Router=router`

### Description {% id="ice.default.router-description" %}

Specifies the default [router](../../runtime/invocation/routers) for all proxies. The value is a stringified proxy for
the Glacier2 router control interface. The default router can be overridden on a proxy using the `ice_router`
[proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx). The default value is no router. This property is only for
proxies: it does not add a router to object adapters.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## Ice.Default.SlicedFormat

### Synopsis {% id="ice.default.slicedformat-synopsis" %}

`Ice.Default.SlicedFormat=num`

### Description {% id="ice.default.slicedformat-description" %}

Specifies the encoding format of Slice classes. The default value is `0`, which selects the compact format; `1` selects
the sliced format. This property applies to version 1.1 of the Ice encoding.

Note that you can also specify whether certain operations use the sliced format by annotating their definitions with
[metadata](../../slice/slice-metadata-directives).

## Ice.Default.SourceAddress

### Synopsis {% id="ice.default.sourceaddress-synopsis" %}

`Ice.Default.SourceAddress=addr`

### Description {% id="ice.default.sourceaddress-description" %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

Specifies the numeric IP address used to bind outgoing socket connections{% iflang langs="cpp,swift" %}, except stream
connections on iOS{% /iflang %}. Selecting a source IP address does not necessarily select the network interface used to
send packets. Proxy endpoints can override this default with the [--sourceAddress](../../runtime/endpoint-syntax)
option. If this property is empty, the operating system selects the source address.

{% /iflang %}

{% iflang langs="js" %}

In Node.js, this property supplies the local address for outgoing TCP connections. Proxy endpoints can override it with
the [--sourceAddress](../../runtime/endpoint-syntax) option. WebSocket connections use the source address selected by
the operating system.

{% /iflang %}
