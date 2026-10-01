{% language-section name="mapping" %}

```csharp
Glacier2.RouterPrx router = Glacier2.RouterPrxHelper.createProxy(
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063");

Glacier2.SessionPrx? session =
    await router.createSessionAsync(Environment.UserName, "password");
```

{% /language-section %}
