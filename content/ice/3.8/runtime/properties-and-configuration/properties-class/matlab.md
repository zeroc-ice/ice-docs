{% language-section name="api" %}

Create a property set with `Ice.Properties`. Passing an argument array parses Ice options and loads configuration files.
The second output contains the unconsumed arguments.

```matlab
[properties, remaining] = Ice.Properties(args);
properties.setProperty('Filesystem.MaxFileSize', '1024');
maxFileSize = properties.getPropertyAsInt('Filesystem.MaxFileSize');
copy = properties.clone();
```

Use `properties.load('config')` to load a file.

{% /language-section %}
