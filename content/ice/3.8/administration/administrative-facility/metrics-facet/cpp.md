{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

To use the `Metrics` facet of your own communicator directly, without a proxy, call `findAdminFacet`:

```cpp
// It's nullptr when the facet is not enabled
auto metricsAdmin = communicator->findAdminFacet<IceMX::MetricsAdmin>("Metrics");
```

{% /language-section %}
