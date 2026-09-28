{% language-section name="api" %}

Create an empty set with `Ice.Properties()`, or pass an argument list to parse arguments and load configuration files.
The constructor removes consumed options from that list. The method names use camelCase.

```py
properties = Ice.Properties(args)
properties.setProperty("Filesystem.MaxFileSize", "1024")
maxFileSize = properties.getPropertyAsInt("Filesystem.MaxFileSize")
copy = properties.clone()
```

Use `properties.load("config")` to load a file.

{% /language-section %}
