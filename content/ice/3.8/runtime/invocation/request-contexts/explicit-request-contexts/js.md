{% language-section name="mapping" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/js/Ice/context) provides a complete example of
using request context in JavaScript.

Using the Slice greeter definitions once again:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

A client application can set a request context to send additional metadata:

```js
// We request a French greeting by setting the context parameter.
let greeting = await greeter.greet(name, new Map([["language", "fr"]]));
```

On the server side, the request context is available through the ctx member of the `Ice.Current` parameter:

```typescript
greet(name: string, current: Ice.Current): string | Promise<string> {
    // We retrieve the value for the language entry in the context.
    const language: string = current.ctx.get("language") || "";
    ...
}
```

{% /language-section %}
