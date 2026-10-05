{% language-section name="configuring-a-router-for-client-invocations-2" %}

```ruby
router = Ice::RouterPrx.new(...)
greeter = VisitorCenter::GreeterPrx.new(...) # normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
