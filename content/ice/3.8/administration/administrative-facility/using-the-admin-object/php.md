{% language-section name="mapping" %}

```php
$admin = ...; // proxy to the admin object
$propAdmin = Ice\PropertiesAdminPrxHelper::uncheckedCast($admin, "Properties");
$props = $propAdmin->getPropertiesForPrefix("");
```

{% /language-section %}
