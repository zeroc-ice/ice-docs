{% language-section name="client" %}

```csharp
string greeting = await greeter.GreetAsync(
    name,
    context: new Dictionary<string, string> { ["language"] = "fr" });
```

{% /language-section %}

{% language-section name="server" %}

```csharp
if (!current.ctx.TryGetValue("language", out string? language))
{
    language = "";
}
```

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Ice/Context) provides a complete example.

{% /language-section %}
