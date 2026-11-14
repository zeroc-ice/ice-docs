{% language-section name="configuring-a-router" %}

```cpp
Ice::RouterPrx router{...};
GreeterPrx greeter{...}; // normal proxy
GreeterPrx routedGreeter = greeter.ice_router(router);
```

{% /language-section %}
