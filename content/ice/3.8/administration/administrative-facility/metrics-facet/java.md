{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

To use the `Metrics` facet of your own communicator directly, without a proxy, call `findAdminFacet`:

```java
com.zeroc.Ice.Object obj = communicator.findAdminFacet("Metrics");
if (obj != null) { // It's null when the facet is not enabled
    var metricsAdmin = (com.zeroc.IceMX.MetricsAdmin)obj;
    ...
}
```

{% /language-section %}
