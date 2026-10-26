{% language-section name="mapping" %}

```py
router = Glacier2.RouterPrx(
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063")
session = await router.createSessionAsync(getpass.getuser(), "password")
```

{% /language-section %}

{% language-section name="greeter-demo" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Glacier2/greeter) provides a complete
client and server in Python, and the configuration of the Glacier2 router between them.

{% /language-section %}
