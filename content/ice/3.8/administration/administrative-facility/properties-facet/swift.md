{% language-section name="mapping" %}

## Receiving Property Updates

An application can register callbacks that the `Properties` facet calls after each `setProperties` invocation. The
servant that implements this facet is a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/nativepropertiesadmin) value, which
`findAdminFacet` returns:

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
