{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```ruby
greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
greeter = greeter.ice_invocationTimeout(2500)
```

{% /language-section %}
