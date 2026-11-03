{% language-section name="configuring-a-router" %}

```matlab
router = Ice.RouterPrx(...)
greeter = visitorcenter.GreeterPrx(...) % normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
