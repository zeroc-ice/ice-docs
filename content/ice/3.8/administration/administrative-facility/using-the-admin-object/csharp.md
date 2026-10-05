{% language-section name="mapping" %}

```csharp
Ice.ObjectPrx admin = ...; // proxy to the admin object
var propAdmin = Ice.PropertiesAdminPrxHelper.uncheckedCast(admin, "Properties");
var props = await propAdmin.getPropertiesForPrefixAsync("");
```

{% /language-section %}
