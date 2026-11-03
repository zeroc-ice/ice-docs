{% language-section name="mapping" %}

```ruby
proxy = GreeterPrx.new(communicator, "greeter:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061")
proxy = proxy.ice_connectionCached(false)
```

{% /language-section %}
