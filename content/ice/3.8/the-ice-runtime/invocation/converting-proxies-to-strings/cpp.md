---
id: converting-proxies-to-strings
language: cpp
---

{% language-section name="lang-1" %}

You can stringify a proxy by calling `ice_toString` on this proxy. For example:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
std::string s = greeter.ice_toString();
```

`ice_toString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and
object adapter ID as specified through the [Ice.ToStringMode](../ice-properties) property.

{% /language-section %}

{% language-section name="lang-2" %}

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
std::map<string, string> propertyMap =
    communicator->proxyToProperty(greeter, "Greeter");
```

{% /language-section %}
