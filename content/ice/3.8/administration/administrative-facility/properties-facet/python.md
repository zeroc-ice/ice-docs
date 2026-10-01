{% language-section name="lang-1" %}

## Obtaining the Local Properties Facet

We [already showed](../using-the-admin-object) how to obtain a proxy for a remote administrative facet, but suppose you
want to interact with the facet in your local address space. The code below shows the necessary steps:

```py
propertiesAdmin = communicator.findAdminFacet("Properties")
if propertiesAdmin is not None:
    assert isinstance(propertiesAdmin, Ice.NativePropertiesAdmin)
    ...
```

The facet is registered with the name `Properties`. `findAdminFacet` returns a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/python/Ice.NativePropertiesAdmin.html) wrapper that provides
access to the C++ facet's update callbacks.

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
