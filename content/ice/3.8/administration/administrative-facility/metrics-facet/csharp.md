{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

`findAdminFacet` returns the servant that implements the `Metrics` facet of your communicator:

```csharp
if (communicator.findAdminFacet("Metrics") is IceMX.MetricsAdmin metricsAdmin)
{
    ...
}
// else, the facet is not enabled
```

{% /language-section %}
