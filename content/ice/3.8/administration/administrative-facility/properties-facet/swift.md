{% language-section name="mapping" %}

The servant that implements this facet is a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/nativepropertiesadmin). You can
retrieve this servant by calling `findAdminFacet`:

```swift
if let propertiesAdmin = communicator.findAdminFacet("Properties") as?
                         NativePropertiesAdmin {
    ...
}
```

`addUpdateCallback(_:)` accepts a `(PropertyDict) -> Void` closure and returns a `PropertiesAdminRemoveCallback` closure
that unregisters it:

```swift
let removeCallback = propertiesAdmin.addUpdateCallback { changes in
    // Apply application settings.
}
// When notifications are no longer needed:
removeCallback()
```

{% /language-section %}
