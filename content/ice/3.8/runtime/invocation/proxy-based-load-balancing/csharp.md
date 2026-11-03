{% language-section name="mapping" %}

```csharp
var proxy = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061");
proxy = GreeterPrxHelper.uncheckedCast(proxy.ice_connectionCached(false));
```

{% /language-section %}
