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

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Glacier2/Greeter) provides a complete
client and server in Swift, and the configuration of the Glacier2 router between them.

{% /language-section %}

{% language-section name="session-demo" %}

The [Glacier2 session demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Glacier2/Session) implements and
configures a session manager in Swift.

{% /language-section %}
