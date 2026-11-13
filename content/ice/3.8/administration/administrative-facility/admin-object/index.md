---
title: The admin Object
---

The `admin` object of a communicator is an Ice object that clients use to administer this communicator remotely. Each
administrative capability is a separate [facet](../../../runtime/facets) of this object.

The Ice runtime provides four built-in facets:

- [Process](../process-facet) lets a client, such as an IceGrid node, gracefully shut down the communicator.
- [Properties](../properties-facet) lets a client read and update the communicator's properties.
- [Logger](../logger-facet) lets a client retrieve recent messages from the Ice logger and receive new ones through a
  remote logger.
- [Metrics](../metrics-facet) lets a client retrieve the metrics of the Ice runtime.

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

An application can
[choose which facets the communicator enables](../filtering-administrative-facets){% iflang langs="cpp,csharp,java,python,swift" %}
and [add its own facets](../custom-administrative-facets){% /iflang %}.

## Hosting the admin Object

When the administrative facility is enabled, Ice hosts the `admin` object in the built-in `Ice.Admin` object
adapter{% iflang langs="cpp,csharp,java,python,swift" %}, or the application hosts it in one of its own object adapters
by calling [`createAdmin`](api:Ice/Communicator.createAdmin){% /iflang %}.
[Creating the admin Object](../creating-the-admin-object) describes how to enable the administrative facility and
configure the `Ice.Admin` object adapter.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

`getAdmin` on the [communicator](api:Ice/Communicator) returns a proxy for the `admin` object.
[Using the admin Object](../using-the-admin-object) describes how to reach its facets.

{% /iflang %}

## See Also

- [Facets](../../../runtime/facets)
- [Using the admin Object](../using-the-admin-object)
- [Ice.Admin.\*](../../../property-reference/ice-admin-properties)
