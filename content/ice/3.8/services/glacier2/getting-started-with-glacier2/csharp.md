{% language-section name="mapping" %}

```csharp
Glacier2.RouterPrx router = Glacier2.RouterPrxHelper.createProxy(
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063");

Glacier2.SessionPrx? session =
    await router.createSessionAsync(Environment.UserName, "password");
```

{% /language-section %}

{% language-section name="greeter-demo" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Glacier2/Greeter) provides a complete
client and server in C#, and the configuration of the Glacier2 router between them.

{% /language-section %}
