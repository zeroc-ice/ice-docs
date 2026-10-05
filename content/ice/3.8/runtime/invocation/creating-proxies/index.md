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

The [proxy properties](../../../property-reference/proxy-properties) cover the proxy settings that a stringified proxy
cannot express, except the compression setting (`ice_compress`), the connection ID (`ice_connectionId`) and a fixed
connection (`ice_fixed`). `propertyToProxy` throws `PropertyException` if it finds a subordinate property that is not
one of these proxy properties.

Note that proxy properties can themselves have proxy properties. For example, the following sets the `EndpointSelection`
property on the default locator's router:

```config
Ice.Default.Locator.Router.EndpointSelection=Ordered
```

{% iflang langs="cpp,csharp,java,js,python,swift" %}

## Creating a Proxy from an Object Adapter

An object adapter can create a proxy for any identity, whether or not it hosts an Ice object with this identity.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

- `createProxy` returns a proxy with the given identity. If the object adapter has an
  [AdapterId](../../../property-reference/object-adapter-properties), the proxy is an indirect proxy that refers to the
  object adapter's `ReplicaGroupId`, or to its `AdapterId` when no replica group ID is set. Otherwise, the proxy is a
  direct proxy that holds the object adapter's published endpoints.
- `createDirectProxy` returns a direct proxy that holds the object adapter's published endpoints.
- `createIndirectProxy` returns an indirect proxy that refers to the object adapter's `AdapterId`, or a
  [well-known proxy](../proxy-endpoints/well-known-proxy) when the object adapter has no adapter ID.

{% /iflang %}

{% iflang langs="js" %}

`createProxy` and `createDirectProxy` both return a direct proxy that holds the object adapter's published endpoints.

{% /iflang %}

{% iflang langs="cpp,csharp,java,js,python,swift" %}

`add`, `addFacet`, `addWithUUID` and `addFacetWithUUID` register a servant with the
[Active Servant Map](../../dispatch/active-servant-map) and return the proxy that `createProxy` creates for the identity
of this servant, with its facet.

All these proxies use the options set by the object adapter's
[ProxyOptions](../../../property-reference/object-adapter-properties) property, such as `-o` for oneway proxies.

{% /iflang %}

{% iflang langs="cpp,csharp,java,js,matlab,python,swift" %}

## Creating a Proxy from a Connection

`createProxy` on a connection returns a fixed proxy with the given identity: invocations on this proxy use only this
connection. A server uses such a proxy to call back a client over a
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
with the requested setting, and leave the original proxy unchanged. See
[ObjectPrx](https://code.zeroc.com/manual/Ice/ObjectPrx) in the API reference for the complete list of factory methods
and the accessors that return the current settings.

The [language mapping for interfaces](../../../slice/interfaces) describes the type of the proxy that these factory
methods return.

## Creating a Proxy of Another Type

`uncheckedCast` and `checkedCast` create a proxy of the desired type from an existing proxy, for the same Ice object.
Despite their names, these functions are not casts: they return a new proxy and leave the original proxy unchanged.
`uncheckedCast` creates the new proxy without contacting the target object. `checkedCast` first calls `ice_isA` on the
target object to verify that it implements the requested interface, and returns a null proxy if it does not.

You rarely need these functions. In new code, you create a typed proxy directly with one of the methods described above,
and an application that converts a proxy of one type into a proxy of another type is uncommon.

{% iflang langs="csharp,java,js,matlab,php,python,ruby,swift" %}

The [language mapping for interfaces](../../../slice/interfaces) shows these functions.

{% /iflang %}

{% iflang langs="cpp" %}

In C++, these functions are the `Ice::uncheckedCast` and `Ice::checkedCast` function templates, for example
`Ice::checkedCast<GreeterPrx>(proxy)`.

{% /iflang %}

## See Also

- [Communicator](../../communicator)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Proxy Properties](../../../property-reference/proxy-properties)
