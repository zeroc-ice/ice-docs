{% language-section name="lang-1" %}

```matlab
admin = ...; % proxy to the admin object
propAdmin = Ice.PropertiesAdminPrx.uncheckedCast(admin, 'Properties');
props = propAdmin.getPropertiesForPrefix('');
```

{% /language-section %}
