{% language-section name="lang-1" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Ice/context) provides a complete example of
using request context in Java.

Using the Slice greeter definitions once again:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

A client application can set a request context to send additional metadata:

```java
// We request a French greeting by setting the context parameter.
String greeting = greeter.greet(name, Map.of("language", "fr"));
```

On the server side, the request context is available through the ctx member of the `com.zeroc.Ice.Current` parameter:

```java
public String greet(String name, Current current) {
    // We retrieve the value for the language entry in the context.
    String language = current.ctx.getOrDefault("language", "");
    ...
}
```

{% /language-section %}
