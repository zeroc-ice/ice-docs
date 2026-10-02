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

[Default properties](../ice-default-properties) affect proxies that you create from strings, or that Ice creates when
unmarshaling the payload of a request or response.

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

[Ice.Override.Compress](../ice-override-properties) overrides the compression setting of all proxies. With
`Ice.Override.Compress=1`, Ice enables compression for all requests; with `Ice.Override.Compress=0`, it disables
compression for all requests. In both cases, Ice ignores the compression setting of each proxy (see `ice_compress`).

The override also sets the compression flag of the endpoints on which object adapters listen, so the proxies that an
object adapter creates from these endpoints carry the overridden compression setting.

{% /iflang %}

{% iflang langs="js" %}

Ice for JavaScript does not support `Ice.Override.Compress`.

{% /iflang %}

## See Also

- [Ice.Default.*](../ice-default-properties)
- [Ice.Override.*](../ice-override-properties)
