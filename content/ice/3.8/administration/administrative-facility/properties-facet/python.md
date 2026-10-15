{% language-section name="mapping" %}

## Obtaining the Local Properties Facet

To use the `Properties` facet of your own communicator without a [proxy](../using-the-admin-object), call
`findAdminFacet`:

```py
propertiesAdmin = communicator.findAdminFacet("Properties")
if propertiesAdmin is not None:
    assert isinstance(propertiesAdmin, Ice.NativePropertiesAdmin)
    ...
```

`findAdminFacet` returns a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/python/Ice.NativePropertiesAdmin.html) wrapper that provides
access to the C++ facet's update callbacks. `removeAdminFacet` returns `None` for this facet.

## Property Update Notifications

The Ice runtime can notify an application whenever its properties change due to invocations of the `setProperties`
operation on the `PropertiesAdmin` interface.

`addUpdateCallback` accepts a callable that takes a `dict[str, str]` and returns `None`. Retain the callable to
unregister it with `removeUpdateCallback`:

```py
def onUpdate(changes: dict[str, str]) -> None:
    """Apply updated application settings."""
    ...

propertiesAdmin.addUpdateCallback(onUpdate)
# When notifications are no longer needed:
propertiesAdmin.removeUpdateCallback(onUpdate)
```

The callback receives added and changed entries with their new values, and removed entries with empty values. A
successful `setProperties` call invokes the registered callbacks even when it changed nothing; the dictionary is then
empty. Direct calls to `Properties.setProperty` do not invoke these callbacks.

{% /language-section %}
