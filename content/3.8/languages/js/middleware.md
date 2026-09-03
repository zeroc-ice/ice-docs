---
id: middleware
language: js
---

{% language-section name="lang-1" %}
In JavaScript, a middleware is a concrete class that implements `Ice.Object` and delegates to another dispatcher called “next”. For example:

```js
// A typical JavaScript middleware class
class AuthorizationMiddleware extends Ice.Object
{
    async dispatch(request) {
        ...
    }
    
    constructor(next, validToken) {
        ...
    }
}
```

```typescript
// A typical TypeScript middleware class
class AuthorizationMiddleware extends Ice.Object
{
    override async dispatch(
        request: Ice.IncomingRequest): Promise<Ice.OutgoingResponse> {
        ...
    }
    
    constructor(next: Ice.Object, validToken: string) {
        ...
    }
}
```

The constructor accepts the “next” dispatcher and other data, and `dispatch` dispatches incoming requests by delegating to “next”.

You install a middleware on an object adapter by calling `use`:

```js
export class ObjectAdapter {
    use(middleware) {
        ...
    }
}
```

```typescript
interface ObjectAdapter
    use(middleware: (next: Ice.Object) => Ice.Object): ObjectAdapter;
}
```

`use` accepts a middleware factory – not a middleware. This allows the object adapter to create and connect the middleware into its dispatch pipeline when it receives its first request.

For example, you can call `use` as follows:

```js
adapter.use(next => new AuthorizationMiddleware(next, "iced tea"));
```

```typescript
adapter.use(next: Ice.Object => new AuthorizationMiddleware(next, "iced tea"));
```

The middleware, once created and woven into the dispatch pipeline, intercept requests in the order of their registration through `use`.
{% /language-section %}
