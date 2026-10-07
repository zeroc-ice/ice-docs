{% language-section name="using-the-implicit-context" %}

```py
implicitContext = communicator.getImplicitContext()
implicitContext.put("language", "fr")

# This invocation sends the "language" entry of the implicit context.
greeting = await greeter.greetAsync(name)
```

{% /language-section %}
