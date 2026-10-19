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

{% callout type="tip" title="Example" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Glacier2/Callback) shows a Swift
client that creates a session with a Glacier2 router and receives callbacks over its connection to the router. Its
`README.md` describes how to run it, and the comments in its `glacier2.conf` describe the router properties.

{% /callout %}

{% /language-section %}
