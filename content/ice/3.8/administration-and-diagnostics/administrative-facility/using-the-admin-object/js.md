{% language-section name="lang-1" %}

```typescript
const admin = ...; // proxy to the admin object
const propAdmin = Ice.PropertiesAdminPrx.uncheckedCast(admin, "Properties");
const props = await propAdmin.getPropertiesForPrefix("");
```

{% /language-section %}
