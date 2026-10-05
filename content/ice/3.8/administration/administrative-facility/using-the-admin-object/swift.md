{% language-section name="mapping" %}

```swift
let admin = // proxy to the admin object
let propAdmin = uncheckedCast(
    prx: admin,
    type: PropertiesAdminPrx.self,
    facet: "Properties"
)

let props = try await propAdmin.getPropertiesForPrefix("")
```

{% /language-section %}
