---
id: per-proxy-request-contexts
language: csharp
---

{% language-section name="lang-1" %}

```csharp
// setting the context on the proxy.
var greeterEs = GreeterPrxHelper.uncheckedCast(
    greeter.ice_context(new Dictionary<string, string> { ["language"] = "es" }));
```

{% /language-section %}
