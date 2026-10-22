{% language-section name="mapping" %}

```csharp
Glacier2.RouterPrx router = ...;
Glacier2.SessionPrx? session = await router.createSessionAsync(...);
// Retrieve the client category after the session is created.
string clientCategory = await router.getCategoryForClientAsync();
```

{% /language-section %}

{% language-section name="callback-demo" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Glacier2/Callback) provides a
complete client and server in C#, and the configuration of the Glacier2 router between them: the client receives
callbacks from the server through its session with the router.

{% /language-section %}
