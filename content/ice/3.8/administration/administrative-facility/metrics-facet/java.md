{% language-section name="lang-1" %}

# Obtaining the Local Metrics Facet

We [already showed](../using-the-admin-object) how to obtain a proxy for a remote administrative facet, but suppose you
want to interact with the facet in your local address space. The code below shows the necessary steps:

```java
com.zeroc.Ice.Object obj = communicator.findAdminFacet("Metrics");
if (obj != null) { // It's null when the facet is not enabled
    var metricsAdmin = (com.zeroc.Ice.MetricsAdmin)obj;
    ...
}
```

{% /language-section %}
