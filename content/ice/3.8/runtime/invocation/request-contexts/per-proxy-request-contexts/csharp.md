{% language-section name="mapping" %}

```csharp
// setting the context on the proxy.
var greeterEs = GreeterPrxHelper.uncheckedCast(
    greeter.ice_context(new Dictionary<string, string> { ["language"] = "es" }));
```

{% /language-section %}
