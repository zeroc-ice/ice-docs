{% language-section name="mapping" %}

```csharp
internal class AuthorizationMiddleware : Ice.Object
{
    public ValueTask<Ice.OutgoingResponse> dispatchAsync(
        Ice.IncomingRequest request)
    {
        ...
    }

    internal AuthorizationMiddleware(Ice.Object next, string validToken)
    {
        ...
    }
}
```

```csharp
adapter.use(next => new AuthorizationMiddleware(next, validToken: "iced tea"));
```

{% /language-section %}
