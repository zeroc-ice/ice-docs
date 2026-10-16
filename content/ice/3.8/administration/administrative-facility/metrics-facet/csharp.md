{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

To use the `Metrics` facet of your own communicator without a [proxy](../using-the-admin-object), call `findAdminFacet`:

```csharp
if (communicator.findAdminFacet("Metrics") is IceMX.MetricsAdmin metricsAdmin)
{
    ...
}
// else, the facet is not enabled
```

{% /language-section %}
