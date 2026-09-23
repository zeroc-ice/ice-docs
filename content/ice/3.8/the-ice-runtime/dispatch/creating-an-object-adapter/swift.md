{% language-section name="lang-1" %}

```swift
let adapter = try communicator.createObjectAdapter("GreeterAdapter")
```

{% /language-section %}

{% language-section name="lang-2" %}

```swift
let adapter = try communicator.createObjectAdapterWithEndpoints(
    name: "GreeterAdapter", endpoints: "tcp -p 4061")
```

{% /language-section %}
