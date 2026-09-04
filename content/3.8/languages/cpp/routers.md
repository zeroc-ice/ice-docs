---
id: routers
language: cpp
---

{% language-section name="lang-1" %}

```cpp
Ice::RouterPrx router{...};
GreeterPrx greeter{...}; // normal proxy;
GreeterPrx routedGreeter = greeter.ice_router(router);
```

`ice_router` returns a new proxy with the requested configuration, and does not change the `greeter` proxy.

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
