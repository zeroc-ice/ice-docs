---
title: Proxy Properties
---

The communicator operation [propertyToProxy](../creating-proxies) creates a proxy from a group of configuration
properties. The argument to `propertyToProxy` is a string representing the base name of the property group (shown as
_name_ in the property descriptions below). This name must correspond to a property that supplies the stringified form
of the proxy. Subordinate properties can be defined to customize the proxy's local configuration.

The communicator operation [proxyToProperty](../converting-proxies-to-strings) performs the inverse operation, that is,
returns the property group for a proxy.

# _name_

#### Synopsis

`name=proxy`

#### Description

The base property of the group with an application-specific `name` supplying the stringified representation of a proxy.
Use the communicator operation `propertyToProxy` to retrieve the property and convert it into a proxy.

{% language-section name="lang-1" /%}

# _name_.ConnectionCached

#### Synopsis

`name.ConnectionCached=num`

#### Description

If `num` is a value greater than zero, the proxy [caches](../connection-establishment) its chosen connection for use in
subsequent requests. Defining this property is equivalent to invoking the `ice_connectionCached` proxy method.

# _name_.Context._key_

#### Synopsis

`name.Context.key=value`

#### Description

Adds the key/value pair to the proxy's [request context](../per-proxy-request-contexts).

# _name_.EndpointSelection

#### Synopsis

`name.EndpointSelection=type`

#### Description

Specifies the proxy's [endpoint selection](../connection-establishment) type. Legal values are `Random` and `Ordered`.
Defining this property is equivalent to invoking the `ice_endpointSelection` proxy method.

# _name_.InvocationTimeout

#### Synopsis

`name.InvocationTimeout=num`

#### Description

Specifies the [invocation timeout](../invocation-timeouts) of this proxy, in milliseconds. Defining this property is
equivalent to invoking the `ice_invocationTimeout` proxy method.

# _name_.Locator

#### Synopsis

`name.Locator=proxy`

#### Description

Specifies the [locator](../locators) of this proxy. Defining this property is equivalent to invoking the `ice_locator`
proxy method.

This is a proxy property, so you can configure additional local aspects of the proxy with subordinate properties. For
example:

```config
MyProxy.Locator=...
MyProxy.Locator.EndpointSelection=Ordered
```

# _name_.LocatorCacheTimeout

#### Synopsis

`name.LocatorCacheTimeout=num`

#### Description

Specifies the [locator cache](../locator-semantics-for-clients) timeout of this proxy, in seconds. Defining this
property is equivalent to invoking the `ice_locatorCacheTimeout` proxy method.

# _name_.Router

#### Synopsis

`name.Router=proxy`

#### Description

Specifies the [router](../glacier2) of this proxy. Defining this property is equivalent to invoking the `ice_router`
proxy method.

This is a proxy property, so you can configure additional local aspects of the proxy with subordinate properties. For
example:

```config
MyProxy.Router=...
MyProxy.Router.EndpointSelection=Ordered
```
