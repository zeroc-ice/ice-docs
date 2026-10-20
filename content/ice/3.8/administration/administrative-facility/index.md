---
title: Administrative Facility
pages:
  - admin-object
  - creating-the-admin-object
  - using-the-admin-object
  - process-facet
  - properties-facet
  - logger-facet
  - metrics-facet
  - filtering-administrative-facets
  - custom-administrative-facets
  - security-considerations-for-administrative-facets
---

The Administrative Facility lets you administer a running Ice application remotely: shut it down, view and change its
configuration properties, read its log, and monitor its metrics. The Ice runtime provides each of these capabilities as
a [facet](../../runtime/facets) of a single [admin object](./admin-object).
{% iflang langs="cpp,csharp,java,python,swift" %}You can also [add your own facets](./custom-administrative-facets) to
this object.{% /iflang %}

## See Also

- [Facets](../../runtime/facets)
- [Object Adapters](../../runtime/dispatch)
