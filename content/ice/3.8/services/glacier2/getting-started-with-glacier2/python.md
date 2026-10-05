{% language-section name="mapping" %}

```py
router = Glacier2.RouterPrx(
    communicator,
    "Glacier2/router:tcp -h localhost -p 4063")
session = await router.createSessionAsync(getpass.getuser(), "password")
```

{% /language-section %}
