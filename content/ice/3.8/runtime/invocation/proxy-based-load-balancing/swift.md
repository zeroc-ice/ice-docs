{% language-section name="mapping" %}

```swift
var proxy = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061",
    type: GreeterPrx.self)
proxy = proxy.ice_connectionCached(false)
proxy = proxy.ice_endpointSelection(.Random)
// If also using a locator:
proxy = proxy.ice_locatorCacheTimeout(...)
```

{% /language-section %}
