{% language-section name="mapping" %}

```js
class AuthorizationMiddleware extends Ice.Object
{
    async dispatch(request) {
        // ...
    }

    constructor(next, validToken) {
        // ...
    }
}
```

```typescript
class AuthorizationMiddleware extends Ice.Object
{
    override async dispatch(
        request: Ice.IncomingRequest): Promise<Ice.OutgoingResponse> {
        // ...
    }

    constructor(next: Ice.Object, validToken: string) {
        // ...
    }
}
```

```js
adapter.use(next => new AuthorizationMiddleware(next, "iced tea"));
```

```typescript
adapter.use((next: Ice.Object) => new AuthorizationMiddleware(next, "iced tea"));
```

{% /language-section %}
