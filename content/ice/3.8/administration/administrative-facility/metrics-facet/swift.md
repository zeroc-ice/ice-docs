{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

The Ice runtime implements the built-in `Metrics` facet without a Swift servant, so the dispatcher that
`communicator.findAdminFacet("Metrics")` returns does not conform to `MetricsAdmin`. To interact with the `Metrics`
facet of your own communicator, use a proxy, as [shown for a remote facet](../using-the-admin-object).

{% /language-section %}
