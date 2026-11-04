---
title: Security Considerations for Administrative Facets
sidebarLabel: Security
languages:
  - cpp
  - csharp
  - java
  - matlab
  - php
  - python
  - ruby
  - swift
---

A client that can reach the [admin object](../admin-object) can use each of its facets: the
[Properties](../properties-facet) facet reads and changes the program's configuration, which can include sensitive
values, the [Process](../process-facet) facet shuts the program down, and the [Logger](../logger-facet) facet returns
its log messages.{% iflang langs="cpp,csharp,java,python,swift" %} Each [custom facet](../custom-administrative-facets)
that an application adds exposes its own operations.{% /iflang %}

## Controlling Access to the admin Object

The administrative facility is [disabled by default](../creating-the-admin-object). [IceGrid](../../../services/icegrid)
enables it in the servers that it activates: the IceGrid node shuts down a server through its `Process` facet, and
IceGrid administrative clients use the `Properties` and `Logger` facets.

When Ice hosts the admin object in the `Ice.Admin` object adapter, an `Ice.Admin.Endpoints` value that listens on the
local host only, such as `tcp -h 127.0.0.1`, restricts access to clients that run on the same host. IceGrid sets this
value for the servers that it activates, unless the server descriptor sets `Ice.Admin.Enabled` or `Ice.Admin.Endpoints`,
and still provides [remote administration](../../../services/icegrid/icegrid-and-the-administrative-facility) by
forwarding requests to the server through its node.

To administer a program from other hosts, give the object adapter that hosts the admin object
[SSL](../../../runtime/ssl-transport) endpoints that require a client certificate, for example with
[IceSSL.VerifyPeer](../../../property-reference/icessl-properties#icessl.verifypeer) set to `2`, its default. Only
clients with a certificate issued by a certificate authority that the object adapter trusts can then connect.

{% iflang langs="cpp,csharp,java" %}

When the admin object needs an SSL configuration different from the communicator's, such as a certificate authority
trusted only for administrative clients, host it in an object adapter that you create with its own server authentication
options, as described in
[Hosting the admin Object in Your Own Object Adapter](../creating-the-admin-object#hosting-the-admin-object-in-your-own-object-adapter).

{% /iflang %}

[Filtering the facets](../filtering-administrative-facets) limits what a client that reaches the admin object can do.

## See Also

- [Creating the admin Object](../creating-the-admin-object)
- [Filtering Administrative Facets](../filtering-administrative-facets)
- [IceGrid and the Administrative Facility](../../../services/icegrid/icegrid-and-the-administrative-facility)
- [SSL Transport](../../../runtime/ssl-transport)
- [Ice.Admin.\*](../../../property-reference/ice-admin-properties)
