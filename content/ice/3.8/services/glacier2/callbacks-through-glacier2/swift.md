{% language-section name="mapping" %}

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

{% language-section name="callback-demo" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Glacier2/Callback) provides a
complete client and server in Swift, and the configuration of the Glacier2 router between them: the client receives
callbacks from the server through its session with the router.

{% /language-section %}
