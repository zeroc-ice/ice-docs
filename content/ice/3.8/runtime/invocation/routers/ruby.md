{% language-section name="configuring-a-router" %}

```ruby
router = Ice::RouterPrx.new(...)
greeter = VisitorCenter::GreeterPrx.new(...) # normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
