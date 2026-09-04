---
id: creating-proxies
language: cpp
---

{% language-section name="lang-1" %}

The generated proxy class provides a constructor that constructs a proxy from a communicator and a
[stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the following example:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
```

{% /language-section %}

{% language-section name="lang-2" %}

We can use the `propertyToProxy` template function on `Communicator` to convert the property's value into a proxy. A
null proxy (`std::nullopt`) is returned if no property is found with the specified name.

```cpp
std::optional<GreeterPrx> greeter =
    communicator->propertyToProxy<Ice::GreeterPrx>("Greeter.Proxy");
```

{% /language-section %}

{% language-section name="lang-3" %}

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
greeter = greeter.ice_endpointSelection(EndpointSelectionType::Ordered);
```

{% /language-section %}

{% language-section name="lang-4" %}

```cpp
std::optional<AccountPrx> account = bank.findAccount("WXY-123456");
```

{% /language-section %}
