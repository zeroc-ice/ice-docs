{% language-section name="mapping" %}

## Receiving Property Updates

An application can register callbacks that the `Properties` facet calls after each `setProperties` invocation. The
servant that implements this facet is a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.NativePropertiesAdmin.html), which
`findAdminFacet` returns:

```csharp
if (communicator.findAdminFacet("Properties") is
    Ice.NativePropertiesAdmin propertiesAdmin)
{
    ...
}
// else, the facet is not enabled
```

Register an `Action<Dictionary<string, string>>` with `addUpdateCallback`. Retain the delegate to unregister it with
`removeUpdateCallback`:

```csharp
Action<Dictionary<string, string>> callback = changes => { /* Apply application settings. */ };
propertiesAdmin.addUpdateCallback(callback);
// When notifications are no longer needed:
propertiesAdmin.removeUpdateCallback(callback);
```

{% /language-section %}
