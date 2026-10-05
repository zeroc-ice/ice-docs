{% language-section name="configuring-a-router-for-client-invocations-1" %}

```csharp
var router = RouterPrxHelper.createProxy(…);
var greeter = GreeterPrxHelper.createProxy(...); // normal proxy
var routedGreeter = GreeterPrxHelper.uncheckedCast(greeter.ice_router(router));
```

{% /language-section %}
