---
title: Custom Administrative Facets
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

An application can add its own facets to the [admin object](../admin-object) by calling `addAdminFacet` on the
[Communicator](api:Ice/Communicator) with a servant and a facet name, and remove them with `removeAdminFacet`. A custom
facet is an Ice object like any other: its servant implements the Slice interface of your choice, and an administrative
client invokes it through a proxy for this facet of the admin object, as described in
[Using the admin Object](../using-the-admin-object).

The [facet filter](../filtering-administrative-facets) applies to custom facets: when `Ice.Admin.Facets` is set, the
communicator exposes a custom facet only if the filter lists its name.

You can add facets before or after the communicator creates the admin object: the admin object hosts the facets added
before its creation.

We provide an example of using these communicator methods in our discussion of the [Process](../process-facet) facet.

## See Also

- [Filtering Administrative Facets](../filtering-administrative-facets)
- [The Process Facet](../process-facet)
