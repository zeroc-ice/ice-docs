{% language-section name="mapping" %}

```py
router = Glacier2.RouterPrx(...)
session = await router.createSessionAsync(...)
# Retrieve the client category after the session is created.
clientCategory = await router.getCategoryForClientAsync()
```

{% /language-section %}

{% language-section name="callback-demo" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Glacier2/callback) provides a
complete client and server in Python, and the configuration of the Glacier2 router between them: the client receives
callbacks from the server through its session with the router.

{% /language-section %}
