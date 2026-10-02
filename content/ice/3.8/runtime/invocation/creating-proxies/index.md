---
title: Creating Proxies
---

This page describes all the ways an application can create a proxy.

## Creating a Proxy from a String

{% language-section name="lang-1" /%}

## Creating a Proxy from a Property

Rather than hard-coding a stringified proxy as the previous example demonstrated, an application can gain more
flexibility by externalizing the proxy in a configuration property. For example, we can define a property that contains
our stringified proxy as follows:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
```

{% language-section name="lang-2" /%}

As an added convenience, `propertyToProxy` allows you to define subordinate properties that configure the proxy's local
settings. The properties below demonstrate this feature:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
Greeter.Proxy.EndpointSelection=Ordered
```

These additional properties simplify the task of customizing a proxy (as you can with
[proxy methods](https://code.zeroc.com/manual/Ice/ObjectPrx)) without the need to change the application's code. The
properties shown above are equivalent to the following statements:

{% language-section name="lang-3" /%}

The [proxy properties](../proxy-properties) cover the proxy settings that a stringified proxy cannot express, except the
compression setting (`ice_compress`), the connection ID (`ice_connectionId`) and a fixed connection (`ice_fixed`).
`propertyToProxy` throws `PropertyException` if it finds a subordinate property that is not one of these proxy
properties.

Note that proxy properties can themselves have proxy properties. For example, the following sets the `EndpointSelection`
property on the default locator's router:

```config
Ice.Default.Locator.Router.EndpointSelection=Ordered
```

{% iflang langs="cpp,csharp,java,js,python,swift" %}

## Creating a Proxy with an Object Adapter

An object adapter can create a proxy for any identity, whether or not it hosts an Ice object with this identity:

- `createProxy` returns a proxy with the given identity. If the object adapter has an
  [AdapterId](../object-adapter-properties), the proxy is an indirect proxy that refers to the object adapter's
  `ReplicaGroupId`, or to its `AdapterId` when no replica group ID is set. Otherwise, the proxy is a direct proxy that
  holds the object adapter's published endpoints.
- `createDirectProxy` returns a direct proxy that holds the object adapter's published endpoints.
- `createIndirectProxy` returns an indirect proxy that refers to the object adapter's `AdapterId`, or a
  [well-known proxy](../well-known-proxy) when the object adapter has no adapter ID.

`add`, `addFacet`, `addWithUUID` and `addFacetWithUUID` register a servant with the
[Active Servant Map](../active-servant-map) and return the proxy that `createProxy` creates for the identity of this
servant, with its facet.

All these proxies use the options set by the object adapter's [ProxyOptions](../object-adapter-properties) property,
such as `-o` for oneway proxies.

{% /iflang %}

{% iflang langs="js" %}

Ice for JavaScript does not provide `createIndirectProxy`.

{% /iflang %}

{% iflang langs="cpp,csharp,java,js,matlab,python,swift" %}

## Creating a Proxy from a Connection

`createProxy` on a connection returns a fixed proxy with the given identity: invocations on this proxy use only this
connection. A server uses such a proxy to call back a client over a
[bidirectional connection](../bidirectional-connections).

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

{% language-section name="lang-4" /%}

## Deriving a Proxy

A proxy is immutable. Its factory methods, such as `ice_oneway`, `ice_facet` and `ice_invocationTimeout`, return a proxy
with the requested setting, and leave the original proxy unchanged. See
[ObjectPrx](https://code.zeroc.com/manual/Ice/ObjectPrx) in the API reference for the complete list of factory methods
and the accessors that return the current settings.

The [language mapping for interfaces](../interfaces) describes the type of the proxy that these factory methods return.

## Casting a Proxy

A cast converts a proxy into a proxy of another type, for the same Ice object. `uncheckedCast` performs this conversion
without contacting the target object. `checkedCast` first calls `ice_isA` on the target object to verify that it
implements the requested interface, and returns a null proxy if it does not. The
[language mapping for interfaces](../interfaces) shows the cast functions of each language.

{% iflang langs="cpp" %}

In C++, the cast functions are the `Ice::uncheckedCast` and `Ice::checkedCast` function templates, for example
`Ice::checkedCast<GreeterPrx>(proxy)`.

{% /iflang %}

## See Also

- [Communicator](../communicator)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Proxy Properties](../proxy-properties)
