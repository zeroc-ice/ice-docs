{% language-section name="mapping" %}

```py
router = Glacier2.RouterPrx(...)
session = await router.createSessionAsync(...)
# Retrieve the client category after the session is created.
clientCategory = await router.getCategoryForClientAsync()
```

{% /language-section %}
