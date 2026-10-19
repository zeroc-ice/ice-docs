{% language-section name="mapping" %}

```py
router = Glacier2.RouterPrx(...)
session = await router.createSessionAsync(...)
# Retrieve the client category after the session is created.
clientCategory = await router.getCategoryForClientAsync()
```

{% /language-section %}

{% language-section name="callback-demo" %}

{% callout type="tip" title="Example" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Glacier2/callback) shows a Python
client that creates a session with a Glacier2 router and receives callbacks over its connection to the router. Its
`README.md` describes how to run it, and the comments in its `glacier2.conf` describe the router properties.

{% /callout %}

{% /language-section %}
