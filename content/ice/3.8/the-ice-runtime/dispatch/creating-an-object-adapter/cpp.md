---
id: creating-an-object-adapter
language: cpp
---

{% language-section name="lang-1" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapter(
    "GreeterAdapter");
```

{% /language-section %}

{% language-section name="lang-2" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
