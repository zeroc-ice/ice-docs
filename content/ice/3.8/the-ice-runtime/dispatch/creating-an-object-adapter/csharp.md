{% language-section name="lang-1" %}

```csharp
Ice.ObjectAdapter adapter = communicator.createObjectAdapter("GreeterAdapter");
```

{% /language-section %}

{% language-section name="lang-2" %}

```csharp
Ice.ObjectAdapter adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
