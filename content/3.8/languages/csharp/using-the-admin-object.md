---
id: using-the-admin-object
language: csharp
---

{% language-section name="lang-1" %}

```csharp
Ice.ObjectPrx admin = ...; // proxy to the admin object
var propAdmin = Ice.PropertiesAdminPrxHelper.uncheckedCast(admin, "Properties");
var props = await propAdmin.getPropertiesForPrefixAsync("");
```

{% /language-section %}
