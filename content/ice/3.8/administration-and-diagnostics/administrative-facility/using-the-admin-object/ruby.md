---
id: using-the-admin-object
language: ruby
---

{% language-section name="lang-1" %}

```ruby
admin = ... # proxy to the admin object
propAdmin = Ice::PropertiesAdminPrx::uncheckedCast(admin, "Properties")
props = propAdmin.getPropertiesForPrefix("")
```

{% /language-section %}
