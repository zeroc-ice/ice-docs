{% language-section name="configuring-a-router-for-client-invocations-1" %}

```cpp
Ice::RouterPrx router{...};
GreeterPrx greeter{...}; // normal proxy;
GreeterPrx routedGreeter = greeter.ice_router(router);
```

`ice_router` returns a new proxy with the requested configuration, and does not change the `greeter` proxy.

{% /language-section %}
