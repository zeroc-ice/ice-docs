{% language-section name="using-the-implicit-context" %}

```cpp
Ice::ImplicitContextPtr implicitContext = communicator->getImplicitContext();
implicitContext->put("language", "fr");

// This invocation sends the "language" entry of the implicit context.
string greeting = greeter->greet(name);
```

{% /language-section %}
