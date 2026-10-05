---
title: Proxy Properties
---

The communicator operation [propertyToProxy](../../runtime/invocation/creating-proxies) creates a proxy from a group of
configuration properties. The argument to `propertyToProxy` is a string representing the base name of the property group
(shown as _name_ in the property descriptions below). This name must correspond to a property that supplies the
stringified form of the proxy. Subordinate properties can be defined to customize the proxy's local configuration.

The communicator operation [proxyToProperty](../../runtime/invocation/converting-proxies-to-strings) performs the
inverse operation, that is, returns the property group for a proxy.

## _name_

### Synopsis {% id="name-synopsis" %}

`name=proxy`

### Description {% id="name-description" %}

The base property of the group with an application-specific `name` supplying the stringified representation of a proxy.
Use the communicator operation `propertyToProxy` to retrieve the property and convert it into a proxy.

{% language-section name="mapping" /%}

## _name_.ConnectionCached

### Synopsis {% id="name.connectioncached-synopsis" %}

`name.ConnectionCached=num`

### Description {% id="name.connectioncached-description" %}

If `num` is a value greater than zero, the proxy [caches](../../runtime/connection-management/connection-establishment)
its chosen connection for use in subsequent requests. Defining this property is equivalent to invoking the
`ice_connectionCached` proxy method.

## _name_.Context._key_

### Synopsis {% id="name.context.key-synopsis" %}

`name.Context.key=value`

### Description {% id="name.context.key-description" %}

Adds the key/value pair to the proxy's
[request context](../../runtime/invocation/request-contexts/per-proxy-request-contexts).

## _name_.EndpointSelection

### Synopsis {% id="name.endpointselection-synopsis" %}

`name.EndpointSelection=type`

### Description {% id="name.endpointselection-description" %}

Specifies the proxy's [endpoint selection](../../runtime/connection-management/connection-establishment) type. Legal
values are `Random` and `Ordered`. Defining this property is equivalent to invoking the `ice_endpointSelection` proxy
method.

## _name_.InvocationTimeout

### Synopsis {% id="name.invocationtimeout-synopsis" %}

`name.InvocationTimeout=num`

### Description {% id="name.invocationtimeout-description" %}

Specifies the [invocation timeout](../../runtime/invocation/invocation-timeouts) of this proxy, in milliseconds. The
default is [Ice.Default.InvocationTimeout](../ice-default-properties#ice.default.invocationtimeout). Defining this
property is equivalent to invoking the `ice_invocationTimeout` proxy method.

## _name_.Locator

### Synopsis {% id="name.locator-synopsis" %}

`name.Locator=proxy`

### Description {% id="name.locator-description" %}

Specifies the [locator](../../runtime/locators) of this proxy. Defining this property is equivalent to invoking the
`ice_locator` proxy method.

This is a proxy property, so you can configure additional local aspects of the proxy with subordinate properties. For
example:

```config
MyProxy.Locator=...
MyProxy.Locator.EndpointSelection=Ordered
```

## _name_.LocatorCacheTimeout

### Synopsis {% id="name.locatorcachetimeout-synopsis" %}

`name.LocatorCacheTimeout=num`

### Description {% id="name.locatorcachetimeout-description" %}

Specifies the [locator cache](../../runtime/locators/locator-semantics-for-clients) timeout of this proxy, in seconds.
The default is [Ice.Default.LocatorCacheTimeout](../ice-default-properties#ice.default.locatorcachetimeout). A value of
0 disables caching. A negative value means cache entries never expire.

## _name_.Router

### Synopsis {% id="name.router-synopsis" %}

`name.Router=proxy`

### Description {% id="name.router-description" %}

Specifies the [router](../../services/glacier2) of this proxy. Defining this property is equivalent to invoking the
`ice_router` proxy method.

This is a proxy property, so you can configure additional local aspects of the proxy with subordinate properties. For
example:

```config
MyProxy.Router=...
MyProxy.Router.EndpointSelection=Ordered
```
