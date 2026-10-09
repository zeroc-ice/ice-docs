{% language-section name="using-the-implicit-context" %}

```swift
let implicitContext = communicator.getImplicitContext()!
implicitContext.put(key: "language", value: "fr")

// This invocation sends the "language" entry of the implicit context.
let greeting = try await greeter.greet(name)
```

{% /language-section %}
