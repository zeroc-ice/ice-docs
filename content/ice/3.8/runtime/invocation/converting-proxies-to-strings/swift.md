{% language-section name="stringifying-a-proxy" %}

You can stringify a proxy by calling `ice_toString` on this proxy, or by reading its `description` property (from
protocol [CustomStringConvertible](https://developer.apple.com/documentation/swift/customstringconvertible)). For
example:

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)

let s = greeter.description;
```

`ice_toString` (or `description`, which is equivalent) stringifies non-printable ASCII characters and non-ASCII
characters in the proxy's identity, facet and object adapter ID as specified through the
[Ice.ToStringMode](../../../property-reference/ice-properties) property.

{% /language-section %}

{% language-section name="proxy-to-property" %}

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)
let proxyDict = communicator.proxyToProperty(proxy: greeter, property: "Greeter")
```

{% /language-section %}
