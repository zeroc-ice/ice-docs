{% language-section name="mapping" %}

## Obtaining the Local Metrics Facet

The Ice runtime implements the built-in `Metrics` facet without a Python servant, so
`communicator.findAdminFacet("Metrics")` returns `None`. To interact with the `Metrics` facet of your own communicator,
use a proxy, as [shown for a remote facet](../using-the-admin-object).

{% /language-section %}
