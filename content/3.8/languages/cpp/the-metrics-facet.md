---
id: the-metrics-facet
language: cpp
---

{% language-section name="lang-1" %}

# Obtaining the Local Metrics Facet

We [already showed](../using-the-admin-object) how to obtain a proxy for a remote administrative facet, but suppose you want to interact with the facet in your local address space. The code below shows the necessary steps:

```cpp
// It's nullptr when the facet is not enabled
auto metricsAdmin = communicator->findAdminFacet<Ice::MetricsAdmin>("Metrics");
```

{% /language-section %}
