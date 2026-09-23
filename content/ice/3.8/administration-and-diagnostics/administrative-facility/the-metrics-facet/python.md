{% language-section name="lang-1" %}

# Obtaining the Local Metrics Facet

We [already showed](../using-the-admin-object) how to obtain a proxy for a remote administrative facet, but suppose you
want to interact with the facet in your local address space. The code below shows the necessary steps:

```py
metricsAdmin = communicator.findAdminFacet("Metrics")
if metricsAdmin is not None:
    assert isinstance(metricsAdmin, Ice.MetricsAdmin)
    ...
```

{% /language-section %}
