---
id: using-the-admin-object
language: cpp
---

{% language-section name="lang-1" %}

```cpp
ObjectPrx admin = ...; // proxy to the admin object
auto propAdmin = admin.ice_facet<PropertiesAdminPrx>("Properties");
Ice::PropertyDict props = propAdmin.getPropertiesForPrefix("");
```

{% /language-section %}
