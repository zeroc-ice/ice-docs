---
id: using-the-admin-object
language: java
---

{% language-section name="lang-1" %}

```java
ObjectPrx admin = ...; // proxy to the admin object
var propAdmin = PropertiesAdminPrx.uncheckedCast(admin, "Properties");
var props = propAdmin.getPropertiesForPrefix("");
```

{% /language-section %}
