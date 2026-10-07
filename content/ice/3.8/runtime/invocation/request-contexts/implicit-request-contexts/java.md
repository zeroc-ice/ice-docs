{% language-section name="using-the-implicit-context" %}

```java
ImplicitContext implicitContext = communicator.getImplicitContext();
implicitContext.put("language", "fr");

// This invocation sends the "language" entry of the implicit context.
String greeting = greeter.greet(name);
```

{% /language-section %}
