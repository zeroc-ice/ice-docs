---
id: explicit-request-contexts
language: csharp
---

{% language-section name="lang-1" %}
The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Ice/Context) provides a complete example of using request context in C#.

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

```csharp
// We request a French greeting by setting the context parameter.
string greeting = await greeter.GreetAsync(
    name,
    context: new Dictionary<string, string> { ["language"] = "fr" });
```

On the server side, the request context is available through the ctx member of the `Ice.Current` parameter:

```csharp
public override string Greet(string name, Ice.Current current)
{
    // We retrieve the value for the language entry in the context.
    if (!current.ctx.TryGetValue("language", out string? language))
    {
        language = "";
    }
    ...
}
```

{% /language-section %}
