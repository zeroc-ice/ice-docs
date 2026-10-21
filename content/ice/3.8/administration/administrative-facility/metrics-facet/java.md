{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

`findAdminFacet` returns the servant that implements the `Metrics` facet of your communicator:

```java
com.zeroc.Ice.Object obj = communicator.findAdminFacet("Metrics");
if (obj != null) { // It's null when the facet is not enabled
    var metricsAdmin = (com.zeroc.IceMX.MetricsAdmin)obj;
    ...
}
```

{% /language-section %}
