{% language-section name="mapping" %}

```java
ObjectPrx admin = ...; // proxy to the admin object
var propAdmin = PropertiesAdminPrx.uncheckedCast(admin, "Properties");
var props = propAdmin.getPropertiesForPrefix("");
```

{% /language-section %}
