{% language-section name="lang-1" %}

```csharp
Glacier2.RouterPrx router = Glacier2.RouterPrxHelper.createProxy(
    communicator,
    "Glacier2/router:tcp -h localhost -p 4063");

Glacier2.SessionPrx? session =
    await router.createSessionAsync(Environment.UserName, "password");
```

{% /language-section %}
