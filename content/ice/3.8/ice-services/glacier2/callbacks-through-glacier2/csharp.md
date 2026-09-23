{% language-section name="lang-1" %}

```csharp
Glacier2.RouterPrx router = ...;
Glacier2.SessionPrx? session = await router.createSessionAsync(...);
// Retrieve the client category after the session is created.
string clientCategory = await router.getCategoryForClientAsync();
```

{% /language-section %}
