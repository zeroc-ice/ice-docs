---
title: The admin Object
---

The `admin` object is an Ice object that exposes the administrative capabilities of a communicator. Each capability is a
separate [facet](../../../runtime/facets) of this object, and an administrative client selects the facet that provides
the capability it needs. The `admin` object has no default facet.

The Ice runtime provides four built-in facets:

- [Process](../process-facet) lets an activation service, such as an IceGrid node, request a graceful shutdown of the
  program.
- [Properties](../properties-facet) reads and updates the communicator's configuration properties.
- [Logger](../logger-facet) returns the recent log messages of the program and forwards new ones to remote loggers.
- [Metrics](../metrics-facet) provides the metrics of the Ice runtime.

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

An application can
[choose which built-in facets the communicator enables](../filtering-administrative-facets){% iflang langs="cpp,csharp,java,python,swift" %}
and [add its own facets](../custom-administrative-facets){% /iflang %}.

## Hosting the admin Object

When the administrative facility is enabled, Ice hosts the `admin` object in the built-in `Ice.Admin` object
adapter{% iflang langs="cpp,csharp,java,python,swift" %}, or the application hosts it in one of its own object adapters
by calling [`createAdmin`](api:Ice/Communicator.createAdmin){% /iflang %}.
[Creating the admin Object](../creating-the-admin-object) describes the configuration.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

Call `getAdmin` on the [Communicator](api:Ice/Communicator) to obtain a proxy for the `admin` object. When
[Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties#ice.admin.delaycreation) postpones the
creation of the `admin` object in the `Ice.Admin` object adapter, the first call to `getAdmin` creates it.
[Using the admin Object](../using-the-admin-object) describes how to reach its facets.

{% /iflang %}

## See Also

- [Facets](../../../runtime/facets)
- [Using the admin Object](../using-the-admin-object)
- [Ice.Admin.\*](../../../property-reference/ice-admin-properties)
