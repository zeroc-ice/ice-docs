---
title: The admin Object
---

## Overview of the admin Object

When the Administrative Facility is enabled, you can configure Ice to host an administrative object in the
[Ice.Admin object adapter](administration/administrative-facility/creating-the-admin-object), or you can
programmatically host this object in your own object adapter.

In this documentation, we refer to the administrative object as the `admin`_object_.

You can retrieve a proxy to the admin object associated with your communicator, if any, by calling `getAdmin` on this
communicator.

## Facets of the admin Object

An Ice object is a collection of sub-objects known as [facets](runtime/facets) whose types are not related. Although
facets are typically used for extending and versioning types, they also allow a group of interfaces with a common
purpose to be consolidated into a single Ice object with an established interface for navigation. These qualities make
facets an excellent match for the requirements of the administrative facility.

Each facet of the `admin` object represents a distinct administrative capability. The object does not have a default
facet (that is, a facet with an empty name). However, the Ice runtime implements several built-in facets that it adds to
the `admin` object:

- the [Process](administration/administrative-facility/process-facet) facet
- the [Properties](administration/administrative-facility/properties-facet) facet
- the [Logger](administration/administrative-facility/logger-facet) facet
- the [Metrics](administration/administrative-facility/metrics-facet) facet

An application can
[control which facets are installed](administration/administrative-facility/filtering-administrative-facets) with a
configuration property. An application can also
[install its own facets](administration/administrative-facility/custom-administrative-facets) if necessary.
Administrative facets don’t inherit from a common Slice interface.

## See Also

- [Creating the admin Object](administration/administrative-facility/creating-the-admin-object)
- [Object Identity](runtime/object-identity)
- [Versioning](versioning)
- [The Process Facet](administration/administrative-facility/process-facet)
- [The Properties Facet](administration/administrative-facility/properties-facet)
- [Filtering Administrative Facets](administration/administrative-facility/filtering-administrative-facets)
- [Custom Administrative Facets](administration/administrative-facility/custom-administrative-facets)
- [Ice.Admin.*](property-reference/ice-admin-properties)
