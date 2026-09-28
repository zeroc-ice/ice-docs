{% language-section name="api" %}

Create an empty set with `new com.zeroc.Ice.Properties()`, or pass `args` to parse arguments and load configuration
files. To collect unconsumed arguments, pass a `List<String>` as the second argument; the input array is unchanged.

```java
var remaining = new java.util.ArrayList<String>();
var properties = new com.zeroc.Ice.Properties(args, remaining);
properties.setProperty("Filesystem.MaxFileSize", "1024");
int maxFileSize = properties.getPropertyAsInt("Filesystem.MaxFileSize");
var copy = properties._clone();
```

Use `properties.load("config")` to load a file and `properties.getUnusedProperties()` to obtain unread property names.

{% /language-section %}
