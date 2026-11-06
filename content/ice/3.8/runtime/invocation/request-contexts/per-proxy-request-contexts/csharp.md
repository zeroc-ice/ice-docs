{% language-section name="mapping" %}

```csharp
var greeterEs = GreeterPrxHelper.uncheckedCast(
    greeter.ice_context(new Dictionary<string, string> { ["language"] = "es" }));
```

{% /language-section %}
