{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

Ice for Python does not expose the built-in `Metrics` facet as a local object: `communicator.findAdminFacet("Metrics")`
returns `None`. To interact with the `Metrics` facet of your own communicator, use a proxy, as
[shown for a remote facet](../using-the-admin-object).

{% /language-section %}
