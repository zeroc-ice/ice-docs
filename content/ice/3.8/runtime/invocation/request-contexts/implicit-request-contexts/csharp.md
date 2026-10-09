{% language-section name="using-the-implicit-context" %}

```csharp
Ice.ImplicitContext implicitContext = communicator.getImplicitContext();
implicitContext.put("language", "fr");

// This invocation sends the "language" entry of the implicit context.
string greeting = await greeter.GreetAsync(name);
```

{% /language-section %}
