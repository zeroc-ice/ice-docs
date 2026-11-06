{% language-section name="mapping" %}

```swift
final class AuthorizationMiddleware: Dispatcher {
    func dispatch(
        _ request: sending IncomingRequest) async throws -> OutgoingResponse {
        ...
    }

    init(next: Dispatcher, validToken: String) {
        ...
    }
}
```

```swift
adapter.use {
    next in AuthorizationMiddleware(next: next, validToken: "iced tea")
}
```

{% /language-section %}
