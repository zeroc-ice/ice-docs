---
id: proxy-based-load-balancing
language: ruby
---

{% language-section name="lang-1" %}

```ruby
proxy = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
proxy = proxy.ice_connectionCached(false)
proxy = proxy.ice_endpointSelection(Ice.EndpointSelectionType.Random);
# If also using a locator:
proxy = proxy.ice_locatorCacheTimeout(...);
```

{% /language-section %}
