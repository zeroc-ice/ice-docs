{% language-section name="mapping" %}

```swift
let router = try makeProxy(
    communicator: communicator,
    proxyString: "Glacier2/router:tcp -h 5.6.7.8 -p 4063",
    type: Glacier2.RouterPrx.self)

let session = try await router.createSession(
    userId: NSUserName(),
    password: "password")
```

{% /language-section %}

{% language-section name="greeter-demo" %}

{% callout type="tip" title="Example" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Glacier2/Greeter) shows a Swift client
that calls an object in a server behind a Glacier2 router, with the server and the router configuration,
`glacier2.conf`.

{% /callout %}

{% /language-section %}

{% language-section name="session-demo" %}

The [Glacier2 session demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Glacier2/Session) implements and
configures a session manager in Swift.

{% /language-section %}
