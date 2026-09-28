{% language-section name="api" %}

Create an empty set with `new Ice.Properties()`, or pass an argument array to parse Ice options. The constructor removes
consumed options from that array.

```js
const properties = new Ice.Properties(args);
properties.setProperty("Filesystem.MaxFileSize", "1024");
const maxFileSize = properties.getPropertyAsInt("Filesystem.MaxFileSize");
const copy = properties.clone();
```

Use `properties.getUnusedProperties()` to obtain unread property names. JavaScript supports programmatic settings and
argument arrays; it has no `load()` method and does not load configuration files through `Ice.Config` or `ICE_CONFIG`.

{% /language-section %}
