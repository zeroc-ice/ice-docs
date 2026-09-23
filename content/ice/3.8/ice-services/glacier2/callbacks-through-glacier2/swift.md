{% language-section name="lang-1" %}

```swift
let router = try makeProxy(
    communicator: communicator,
    proxyString: "...",
    type: Glacier2.RouterPrx.self)
let session = try await router.createSession(...)
// Retrieve the client category after the session is created.
let clientCategory = try await router.getCategoryForClient()
```

{% /language-section %}
