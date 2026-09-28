{% language-section name="api" %}

Create an empty set with `Ice::createProperties()`, or pass an argument array to parse arguments and load configuration
files. The function removes consumed options from that array.

```ruby
properties = Ice::createProperties(args)
properties.setProperty("Filesystem.MaxFileSize", "1024")
maxFileSize = properties.getPropertyAsInt("Filesystem.MaxFileSize")
copy = properties.clone()
```

Use `properties.load("config")` to load a file.

{% /language-section %}
