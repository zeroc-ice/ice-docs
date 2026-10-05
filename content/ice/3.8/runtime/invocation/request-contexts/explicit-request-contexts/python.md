{% language-section name="mapping" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Ice/context) provides a complete example
of using request context in Python.

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

```py
# We request a French greeting by setting the context parameter.
greeting = await greeter.greetAsync(name, context={"language": "fr"})
```

On the server side, the request context is available through the ctx member of the `Ice.Current` parameter:

```py
def greet(self, name: str, current: Ice.Current) -> str:
    # We retrieve the value for the language entry in the context.
    language = current.ctx.get("language", "")
```

{% /language-section %}
