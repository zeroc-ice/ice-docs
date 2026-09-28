{% language-section name="api" %}

Create an empty set with `new Ice.Properties()`, or pass `ref args` to parse arguments and load configuration files. The
constructor replaces `args` with the unconsumed arguments.

```csharp
var properties = new Ice.Properties(ref args);
properties.setProperty("Filesystem.MaxFileSize", "1024");
int maxFileSize = properties.getPropertyAsInt("Filesystem.MaxFileSize");
Ice.Properties copy = properties.Clone();
```

Use `properties.load("config")` to load a file and `properties.getUnusedProperties()` to obtain unread property names.

{% /language-section %}
