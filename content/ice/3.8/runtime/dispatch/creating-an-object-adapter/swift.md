{% language-section name="create" %}

```swift
let adapter = try communicator.createObjectAdapter("GreeterAdapter")
```

{% /language-section %}

{% language-section name="create-with-endpoints" %}

```swift
let adapter = try communicator.createObjectAdapterWithEndpoints(
    name: "GreeterAdapter", endpoints: "tcp -p 4061")
```

{% /language-section %}
