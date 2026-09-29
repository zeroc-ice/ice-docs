---
title: Custom Administrative Facets
---

An application can add and remove administrative facets by calling `addAdminFacet` resp. `removeAdminFacet` on the
[Communicator](https://code.zeroc.com/manual/Ice/Communicator).

The `addAdminFacet` method installs a new facet with the given name, or throw `AlreadyRegisteredException` if a facet
already exists with the same name. The `removeAdminFacet` method removes (and returns) the facet with the given name, or
throws `NotRegisteredException` if no matching facet is found.

The mechanism for [filtering administrative facets](../filtering-administrative-facets) also applies to
application-defined facets. If you call `addAdminFacet` while a filter is in effect, and the name of your custom facet
does not match the filter, the communicator will not expose your facet but instead keeps a reference to it so that a
subsequent call to `removeAdminFacet` is possible.

We provide an example of using these communicator methods in our discussion of the [Process](../process-facet) facet.

##### See Also

- [Filtering Administrative Facets](../filtering-administrative-facets)
- [The Process Facet](../process-facet)
