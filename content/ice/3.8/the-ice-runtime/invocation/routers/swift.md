{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```swift
let router = try makeProxy(
    communicator: communicator, proxyString: "...",
    type: GreeterPrx.self)
let greeter = try makeProxy(
    communicator: communicator, proxyString: "...",
    type: GreeterPrx.self)
let routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
