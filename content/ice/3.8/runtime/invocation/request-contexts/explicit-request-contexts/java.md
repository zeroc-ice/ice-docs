{% language-section name="client" %}

```java
String greeting = greeter.greet(name, Map.of("language", "fr"));
```

{% /language-section %}

{% language-section name="server" %}

```java
String language = current.ctx.getOrDefault("language", "");
```

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Ice/context) provides a complete example.

{% /language-section %}
