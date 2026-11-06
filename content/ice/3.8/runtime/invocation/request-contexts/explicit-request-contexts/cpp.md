{% language-section name="client" %}

```cpp
string greeting = greeter->greet(name, {{"language", "fr"}});
```

{% /language-section %}

{% language-section name="server" %}

```cpp
auto p = current.ctx.find("language");
string language = p != current.ctx.end() ? p->second : "";
```

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Ice/context) provides a complete example.

{% /language-section %}
