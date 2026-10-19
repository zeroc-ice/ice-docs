{% language-section name="mapping" %}

```csharp
Glacier2.RouterPrx router = ...;
Glacier2.SessionPrx? session = await router.createSessionAsync(...);
// Retrieve the client category after the session is created.
string clientCategory = await router.getCategoryForClientAsync();
```

{% /language-section %}

{% language-section name="callback-demo" %}

{% callout type="tip" title="Example" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Glacier2/Callback) shows a C# client
that creates a session with a Glacier2 router and receives callbacks over its connection to the router. Its `README.md`
describes how to run it, and the comments in its `glacier2.conf` describe the router properties.

{% /callout %}

{% /language-section %}
