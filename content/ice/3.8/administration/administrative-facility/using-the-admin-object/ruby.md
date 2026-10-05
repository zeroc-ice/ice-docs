{% language-section name="mapping" %}

```ruby
admin = ... # proxy to the admin object
propAdmin = Ice::PropertiesAdminPrx::uncheckedCast(admin, facet: "Properties")
props = propAdmin.getPropertiesForPrefix("")
```

{% /language-section %}
