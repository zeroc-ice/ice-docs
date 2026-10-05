{% language-section name="mapping" %}

```swift
let router = try makeProxy(
    communicator: communicator,
    proxyString: "Glacier2/router:tcp -h localhost -p 4063",
    type: Glacier2.RouterPrx.self)

let session = try await router.createSession(
    userId: NSUserName(),
    password: "password")
```

{% /language-section %}
