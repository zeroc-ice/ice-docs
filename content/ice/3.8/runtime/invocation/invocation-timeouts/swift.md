{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```swift
var greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:tcp -h localhost -p 4061",
    type: GreeterPrx.self)
greeter = greeter.ice_invocationTimeout(2500)
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```swift
do {
    greeting = try await greeter.greet("alice")
    ...
} catch let error as Ice.InvocationTimeoutException {
    print("invocation timed out")
}
```

{% /language-section %}
