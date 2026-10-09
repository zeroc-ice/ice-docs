{% language-section name="using-the-implicit-context" %}

```ruby
implicitContext = communicator.getImplicitContext()
implicitContext.put("language", "fr")

# This invocation sends the "language" entry of the implicit context.
greeting = greeter.greet(name)
```

{% /language-section %}
