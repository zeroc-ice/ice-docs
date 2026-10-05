{% language-section name="mapping" %}

```py
admin = ... # proxy to the admin object
propAdmin = Ice.PropertiesAdminPrx.uncheckedCast(admin, "Properties")
props = await propAdmin.getPropertiesForPrefixAsync("")
```

{% /language-section %}
