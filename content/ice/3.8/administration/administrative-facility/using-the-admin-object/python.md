{% language-section name="lang-1" %}

```py
admin = ... # proxy to the admin object
propAdmin = Ice.PropertiesAdminPrx.uncheckedCast(admin, "Properties")
props = await propAdmin.getPropertiesForPrefixAsync("")
```

{% /language-section %}
