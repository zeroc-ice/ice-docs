{% language-section name="mapping" %}

```swift
var proxy = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061",
    type: GreeterPrx.self)
proxy = proxy.ice_connectionCached(false)
```

{% /language-section %}
