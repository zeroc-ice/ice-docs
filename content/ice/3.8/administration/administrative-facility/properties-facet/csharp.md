{% language-section name="mapping" %}

The servant that implements this facet is a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.NativePropertiesAdmin.html). You can retrieve
this servant by calling `findAdminFacet`:

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
