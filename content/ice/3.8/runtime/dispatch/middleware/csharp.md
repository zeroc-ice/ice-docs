{% language-section name="mapping" %}

In C#, a middleware is a concrete class that implements `Ice.Object` and delegates to another dispatcher called “next”.
For example:

```csharp
// A typical C# middleware class
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

The constructor accepts the “next” dispatcher and other data, and `dispatch` dispatches incoming requests by delegating
to “next”.

You install a middleware on an object adapter by calling `use`:

```csharp
public sealed class ObjectAdapter
{
    public ObjectAdapter use(Func<Object, Object> middleware)
    {
        ...
    }
}
```

`use` accepts a middleware factory – not a middleware. This allows the object adapter to create and connect the
middleware into its dispatch pipeline when it receives its first request.

For example, you can call `use` as follows:

```csharp
 adapter.use(
   next => new Server.AuthorizationMiddleware(next, validToken: "iced tea"));
```

The middleware, once created and woven into the dispatch pipeline, intercept requests in the order of their registration
through `use`.

{% /language-section %}
