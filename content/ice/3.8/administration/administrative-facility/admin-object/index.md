---
title: The admin Object
---

The `admin` object is an Ice object that lets clients inspect and control aspects of its communicator. Each capability
is a separate [facet](../../../runtime/facets) of this object.

The Ice runtime provides four built-in facets:

- [Process](../process-facet) lets a client, such as an IceGrid node, gracefully shut down the communicator.
- [Properties](../properties-facet) lets a client read and update the communicator's properties.
- [Logger](../logger-facet) lets a client retrieve recent messages from the Ice logger and receive new ones through a
  remote logger.
- [Metrics](../metrics-facet) lets a client retrieve the metrics of the Ice runtime.

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
