---
title: Proxy Defaults and Overrides
---

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

Two kinds of Ice configuration properties affect proxies: the default properties, which set the initial settings of new
proxies, and the compression override, which replaces the compression setting of all proxies.

{% /iflang %}

{% iflang langs="js" %}

The default properties of Ice set the initial settings of new proxies.

{% /iflang %}

## Proxy Default Properties

[Default properties](../../../property-reference/ice-default-properties) affect proxies that you create from strings, or
that Ice creates when unmarshaling the payload of a request or response.

For example, suppose we define the following default property:

```config
Ice.Default.EndpointSelection=Ordered
```

We can verify that the property has the desired affect using the following C++ code:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
assert(greeter.ice_getEndpointSelection() == Ice::EndpointSelectionType::Ordered);
```

## The Compression Override

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

[Ice.Override.Compress](../../../property-reference/ice-override-properties) overrides the compression setting of all
proxies; see [Compression](../../compression#enabling-compression).

{% /iflang %}

{% iflang langs="js" %}

Ice for JavaScript does not support `Ice.Override.Compress`.

{% /iflang %}

## See Also

- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Ice.Override.*](../../../property-reference/ice-override-properties)
