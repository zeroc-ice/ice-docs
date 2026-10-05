{% language-section name="using-the-ssl-transport-1" %}

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:ssl -h localhost -p 4061",
    type: GreeterPrx.self)
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-2" %}

```swift
let adapter = try communicator.createObjectAdapterWithEndpoints(
    name: "GreeterAdapter",
    endpoints: "ssl -p 4061")
```

{% /language-section %}
