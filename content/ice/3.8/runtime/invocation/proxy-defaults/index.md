---
title: Proxy Defaults
---

[Default properties](../../../property-reference/ice-default-properties) set the initial settings of the proxies you
create from strings and of the proxies Ice creates when unmarshaling the payload of a request or response.

For example, suppose we define the following default property:

```config
Ice.Default.EndpointSelection=Ordered
```

We can verify that the property has the desired effect using the following C++ code:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
assert(greeter.ice_getEndpointSelection() == Ice::EndpointSelectionType::Ordered);
```

## See Also

- [Ice.Default.*](../../../property-reference/ice-default-properties)
