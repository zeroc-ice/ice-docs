---
id: proxy-based-load-balancing
language: swift
---

{% language-section name="lang-1" %}

```swift
var proxy = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)
proxy = proxy.ice_connectionCached(false)
proxy = proxy.ice_endpointSelection(.Random)
// If also using a locator:
proxy = proxy.ice_locatorCacheTimeout(...)
```

{% /language-section %}
