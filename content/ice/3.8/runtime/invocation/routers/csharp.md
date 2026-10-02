{% language-section name="lang-1" %}

```csharp
var router = RouterPrxHelper.createProxy(…);
var greeter = GreeterPrxHelper.createProxy(...); // normal proxy
var routedGreeter = GreeterPrxHelper.uncheckedCast(greeter.ice_router(router));
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
