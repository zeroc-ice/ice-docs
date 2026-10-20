---
title: Custom Administrative Facets
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

Applications can add custom facets to the [admin object](../admin-object) by calling `addAdminFacet` on the
[Communicator](api:Ice/Communicator) with a servant and facet name, before or after the admin object is created, and
remove them with `removeAdminFacet`.

A custom facet's servant implements a Slice interface of your choice. Administrative clients invoke it through a proxy
to the corresponding facet of the admin object, as described in [Using the admin Object](../using-the-admin-object).

The [facet filter](../filtering-administrative-facets) also applies to custom facets. When `Ice.Admin.Facets` is set,
the communicator exposes only the facets that the filter lists. Excluded facets remain registered: `findAdminFacet` and
`findAllAdminFacets` still return their servants, and `removeAdminFacet` removes them.

For an example, see the [Process](../process-facet) facet.

## See Also

- [Filtering Administrative Facets](../filtering-administrative-facets)
- [The Process Facet](../process-facet)
