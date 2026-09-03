---
id: routers
language: ruby
---

{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```ruby
router = Ice::RouterPrx.new(...)
greeter = VisitorCenter::GreeterPrx.new(...) # normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
