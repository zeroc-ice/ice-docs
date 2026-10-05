{% language-section name="mapping" %}

In Swift, a middleware is a type that implements `Ice.Dispatcher` protocol and delegates to another dispatcher called
“next”. For example:

```swift
// A typical Swift middleware class
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

The constructor accepts the “next” dispatcher and other data, and `dispatch` dispatches incoming requests by delegating
to “next”.

You install a middleware on an object adapter by calling `use`:

```swift
public protocol ObjectAdapter: AnyObject, Sendable {
    @discardableResult
    func use(_ middlewareFactory: @escaping (
        _ next: Dispatcher) -> Dispatcher) -> Self
}
```

`use` accepts a middleware factory – not a middleware. This allows the object adapter to create and connect the
middleware into its dispatch pipeline when it receives its first request.

For example, you can call `use` as follows:

```swift
adapter.use {
    next in AuthorizationMiddleware(next: next, validToken: "iced tea")
}
```

The middleware, once created and woven into the dispatch pipeline, intercept requests in the order of their registration
through `use`.

{% /language-section %}
