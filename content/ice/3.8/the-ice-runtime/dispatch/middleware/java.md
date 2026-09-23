{% language-section name="lang-1" %}

In Java, a middleware is a concrete class that implements `Ice.Object` and delegates to another dispatcher called
“next”. For example:

```java
// A typical Java middleware class
class AuthorizationMiddleware implements com.zeroc.Ice.Object
{
    public CompletionStage<OutgoingResponse> dispatch(
        IncomingRequest request) throws UserException {
        ...
    }

    AuthorizationMiddleware(com.zeroc.Ice.Object next, String validToken) {
        ...
    }
}
```

The constructor accepts the “next” dispatcher and other data, and `dispatch` dispatches incoming requests by delegating
to “next”.

You install a middleware on an object adapter by calling `use`:

```java
public final class ObjectAdapter
    public ObjectAdapter use(Function<Object, Object> middleware) {
    }
}
```

`use` accepts a middleware factory – not a middleware. This allows the object adapter to create and connect the
middleware into its dispatch pipeline when it receives its first request.

For example, you can call `use` as follows:

```java
adapter.use(next -> new AuthorizationMiddleware(next, "iced tea"));
```

The middleware, once created and woven into the dispatch pipeline, intercept requests in the order of their registration
through `use`.

{% /language-section %}
