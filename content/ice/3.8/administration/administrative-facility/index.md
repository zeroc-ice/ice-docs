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
a [facet](../../runtime/facets) of a single [admin object](./admin-object), to which you can add your own facets.
[IceGrid](../../services/icegrid) relies on this facility to manage the servers it deploys.

## See Also

- [Facets](../../runtime/facets)
- [Object Adapters](../../runtime/dispatch)
