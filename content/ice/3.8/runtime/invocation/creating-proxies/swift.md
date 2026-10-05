{% language-section name="creating-a-proxy-from-a-string" %}

The Slice compiler generates a `makeProxy` function that allows you to construct a proxy from a communicator and a
[stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the following example:

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-1" %}

We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. A null proxy
(nil) is returned if no property is found with the specified name.

```swift
let greeter = try communicator.propertyToProxy("Greeter.Proxy")
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-2" %}

```swift
var greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)

greeter = greeter.ice_endpointSelection(.Ordered)
```

{% /language-section %}

{% language-section name="receiving-a-proxy-from-an-operation" %}

```swift
let account = try await bank.findAccount("WXY-123456")
```

{% /language-section %}
