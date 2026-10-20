{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

`findAdminFacet` returns the servant that implements the `Metrics` facet of your communicator:

```cpp
// It's nullptr when the facet is not enabled
auto metricsAdmin = communicator->findAdminFacet<IceMX::MetricsAdmin>("Metrics");
```

{% /language-section %}
