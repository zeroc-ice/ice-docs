---
title: Creating Proxies
---

This page describes all the ways an application can create a proxy.

## Creating a Proxy from a String

{% language-section name="creating-a-proxy-from-a-string" /%}

## Creating a Proxy from a Property

Rather than hard-coding a stringified proxy as the previous example demonstrated, an application can gain more
flexibility by externalizing the proxy in a configuration property. For example, we can define a property that contains
our stringified proxy as follows:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
```

{% language-section name="creating-a-proxy-from-a-property-1" /%}

{% iflang langs="csharp,java,js,matlab,python,ruby,swift" %}

`propertyToProxy` returns an `ObjectPrx`. Call [`uncheckedCast`](../../../slice/interfaces#uncheckedcast) on this base
proxy to create a `GreeterPrx`.

{% /iflang %}

As an added convenience, `propertyToProxy` allows you to define subordinate properties that configure the proxy's local
settings. The properties below demonstrate this feature:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
Greeter.Proxy.EndpointSelection=Ordered
```

These additional properties simplify the task of customizing a proxy (as you can with
[proxy methods](api:Ice/ObjectPrx)) without the need to change the application's code. The properties shown above are
equivalent to the following statements:

{% language-section name="creating-a-proxy-from-a-property-2" /%}

The [Proxy Properties](../../../property-reference/proxy-properties) page lists the properties you can define this way.

Note that proxy properties can themselves have proxy properties. For example, the following sets the `EndpointSelection`
property on the default locator's router:

```config
Ice.Default.Locator.Router.EndpointSelection=Ordered
```

{% iflang langs="cpp,csharp,java,js,python,swift" %}

## Creating a Proxy from an Object Adapter

An object adapter creates the proxies that clients use to call operations on the Ice objects it hosts. `createProxy`
returns a proxy with the given identity, and `add`, `addFacet`, `addWithUUID` and `addFacetWithUUID` register a servant
with the [Active Servant Map](../../dispatch/active-servant-map) and return a proxy for the Ice object this servant
implements. See [ObjectAdapter](api:Ice/ObjectAdapter) in the API reference for all the methods that create proxies.

These proxies use the options set by the object adapter's
[ProxyOptions](../../../property-reference/object-adapter-properties) property, such as `-o` for oneway proxies.

{% /iflang %}

{% iflang langs="cpp,csharp,java,js,matlab,python,swift" %}

## Creating a Proxy from a Connection

`createProxy` on a connection returns a fixed proxy: invocations on this proxy use only this connection. A server uses
such a proxy to call back a client over a
[bidirectional connection](../../connection-management/bidirectional-connections).

{% /iflang %}

## Receiving a Proxy from an Operation

An application can also receive a proxy as the result of an Ice invocation. Consider the following Slice definitions:

```slice
interface Account { ... }
interface Bank
{
    Account* findAccount(string id);
}
```

Invoking the `findAccount` operation returns a proxy for an `Account` object.

For example:

{% language-section name="receiving-a-proxy-from-an-operation" /%}

## Proxy Factory Methods

A proxy is immutable. Its factory methods, such as `ice_oneway`, `ice_facet` and `ice_invocationTimeout`, return a proxy
with the requested setting, and leave the original proxy unchanged. See [ObjectPrx](api:Ice/ObjectPrx) in the API
reference for the complete list of factory methods and the accessors that return the current settings.

The [language mapping for interfaces](../../../slice/interfaces) describes the type of the proxy that these factory
methods return.

## Creating a Proxy of Another Type

`uncheckedCast` and `checkedCast` create a proxy of the desired type from an existing proxy, for the same Ice object.
Despite their names, these functions are not casts: they return a new proxy and leave the original proxy unchanged.
`uncheckedCast` creates the new proxy without contacting the target object. `checkedCast` first calls `ice_isA` on the
target object to verify that it implements the requested interface, and returns a null proxy if it does not.

You rarely need these functions. You use them when you hold a proxy of a more general type than the interface you want
to call, such as the proxy returned by an operation whose return type is `Object*`.

{% iflang langs="csharp,java,js,matlab,php,python,ruby,swift" %}

The [language mapping for interfaces](../../../slice/interfaces) shows these functions.

{% /iflang %}

{% iflang langs="cpp" %}

In C++, these functions are the `Ice::uncheckedCast` and `Ice::checkedCast` function templates, for example
`Ice::checkedCast<GreeterPrx>(proxy)`.

{% /iflang %}

## Local Settings

A proxy has two kinds of settings. Ice marshals the identity, facet, invocation mode, encoding version, and endpoints or
adapter ID of a proxy when it sends the proxy to another application. The other settings, such as the router, locator,
locator cache timeout, endpoint selection type, connection caching, invocation timeout, context and connection ID, are
local, and Ice does not marshal them.

A proxy that Ice unmarshals starts with the default value of each local setting, whatever the value of this setting in
the application that sent the proxy.

## Proxy Defaults

The [Ice.Default.*](../../../property-reference/ice-default-properties) properties set the initial settings of the
proxies you create from a string or a property, of the proxies an object adapter creates, and of the proxies Ice
unmarshals from the payload of a request or response. A proxy property overrides the corresponding default for the proxy
that `propertyToProxy` creates.

For example, the following property sets the endpoint selection type of these proxies to `Ordered`:

```config
Ice.Default.EndpointSelection=Ordered
```

## See Also

- [Communicator](../../communicator)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Proxy Properties](../../../property-reference/proxy-properties)
