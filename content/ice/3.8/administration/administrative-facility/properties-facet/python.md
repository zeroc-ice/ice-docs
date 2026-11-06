{% language-section name="mapping" %}

## Receiving Property Updates

An application can register callbacks that the `Properties` facet calls after each `setProperties` invocation.
`findAdminFacet` returns a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/python/Ice.NativePropertiesAdmin.html) wrapper that provides
access to the update callbacks of this facet. `removeAdminFacet` returns `None` for this facet.

```py
propertiesAdmin = communicator.findAdminFacet("Properties")
if propertiesAdmin is not None:
    assert isinstance(propertiesAdmin, Ice.NativePropertiesAdmin)
    ...
```

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

{% /language-section %}
