---
id: converting-proxies-to-strings
language: swift
---

{% language-section name="lang-1" %}

You can stringify a proxy by calling `ice_toString` on this proxy, or by reading its `description` property (from
protocol [CustomStringConvertible](https://developer.apple.com/documentation/swift/customstringconvertible)). For
example:

```matlab
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)

let s = greeter.description;
```

`ice_toString` (or `description`, which is equivalent) stringifies non-printable ASCII characters and non-ASCII
characters in the proxy's identity, facet and object adapter ID as specified through the
[Ice.ToStringMode](../ice-properties) property.

{% /language-section %}

{% language-section name="lang-2" %}

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)
let proxyDict = communicator.proxyToProperty(proxy: greeter, property: "Greeter")
```

{% /language-section %}
