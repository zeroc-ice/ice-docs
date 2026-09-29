{% language-section name="lang-1" %}

```ruby
greeter = GreeterPrx.new(communicator, "greeter:tcp -h localhost -p 4061")
greeter = greeter.ice_invocationTimeout(2500)
```

{% /language-section %}

{% language-section name="lang-2" %}

```ruby
begin
    greeting = greet.greet("alice")
    ...
rescue Ice::InvocationTimeoutException => exception
    puts "invocation timed out"
end
```

{% /language-section %}
