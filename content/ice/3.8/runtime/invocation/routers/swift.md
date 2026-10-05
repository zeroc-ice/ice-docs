{% language-section name="configuring-a-router-for-client-invocations-2" %}

```swift
let router = try makeProxy(
    communicator: communicator, proxyString: "...",
    type: RouterPrx.self)
let greeter = try makeProxy(
    communicator: communicator, proxyString: "...",
    type: GreeterPrx.self)
let routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
