---
id: proxy-defaults-and-overrides
title: Proxy Defaults and Overrides
---

Proxies are influenced by Ice configuration properties and settings. The relevant properties can be classified into two
categories: defaults and overrides.

# Proxy Default Properties

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

# Proxy Override Properties

Defining an override property causes the Ice runtime to ignore any equivalent proxy option and use the override property
value instead. For example, consider the following property definition:

```config
Ice.Override.Compress=1
```

This property instructs the Ice runtime to use only “compressed” requests, producing the same semantics as calling
`ice_compress(true)` on every proxy. However, the property does not alter the existing proxy, but rather directs the Ice
communicator to use protocol compression for all requests.

{% callout type="info" %}

Previous versions of Ice had many override properties. As of Ice 3.8, `Ice.Override.Compress` is the only override
property left.

{% /callout %}

##### See Also

- [Ice.Default.*](../ice-default-properties)
- [Ice.Override.*](../ice-override-properties)
