{% language-section name="mapping" %}

```java
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

```java
adapter.use(next -> new AuthorizationMiddleware(next, "iced tea"));
```

{% /language-section %}
