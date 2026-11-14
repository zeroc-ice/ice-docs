{% language-section name="configuring-a-router" %}

```csharp
var router = RouterPrxHelper.createProxy(...);
var greeter = GreeterPrxHelper.createProxy(...); // normal proxy
var routedGreeter = GreeterPrxHelper.uncheckedCast(greeter.ice_router(router));
```

{% /language-section %}
