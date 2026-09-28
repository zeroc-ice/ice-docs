{% language-section name="api" %}

Create an empty set with `std::make_shared<Ice::Properties>()`, or pass `argc, argv` to parse arguments and load
configuration files. The constructor removes consumed arguments from `argv` and updates `argc`.

```cpp
auto properties = std::make_shared<Ice::Properties>(argc, argv);
properties->setProperty("Filesystem.MaxFileSize", "1024");
int maxFileSize = properties->getPropertyAsInt("Filesystem.MaxFileSize");
auto copy = properties->clone();
```

Use `properties->load("config")` to load a file and `properties->getUnusedProperties()` to obtain unread property names.

{% /language-section %}
