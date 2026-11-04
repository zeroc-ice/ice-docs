---
title: Securing the admin Object
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

A client that can reach the [admin object](../admin-object) can use each of its facets:

- the [Properties](../properties-facet) facet reads and changes the program's configuration, which can include sensitive
  values;
- the [Process](../process-facet) facet shuts the program down;
- the [Logger](../logger-facet) facet returns the program's log messages.

{% iflang langs="cpp,csharp,java,python,swift" %}

Each [custom facet](../custom-administrative-facets) that an application adds exposes its own operations.

{% /iflang %}

The administrative facility is [disabled by default](../creating-the-admin-object).

## Restricting Access

An `Ice.Admin.Endpoints` value that listens on the local host only restricts access to processes that run on the same
host, and any of these processes can reach the admin object:

```config
Ice.Admin.Endpoints=tcp -h 127.0.0.1
```

For remote administration, give the object adapter that hosts the admin object [SSL](../../../runtime/ssl-transport)
endpoints that require a client certificate, for example with
[IceSSL.VerifyPeer](../../../property-reference/icessl-properties#icessl.verifypeer) set to `2`, its default. Every
client with a certificate issued by a certificate authority that the object adapter trusts can then connect, so trust
only the certificate authorities that issue certificates to administrative clients.

{% iflang langs="cpp,csharp,java" %}

When the admin object needs an SSL configuration different from the communicator's, such as a certificate authority
trusted only for administrative clients, host it in an object adapter that you create with its own server authentication
options, as described in
[Hosting the admin Object in Your Own Object Adapter](../creating-the-admin-object#hosting-the-admin-object-in-your-own-object-adapter).

{% /iflang %}

[IceGrid](../../../services/icegrid) enables the administrative facility in the servers that it activates and
[limits their admin endpoints to the local host](../../../services/icegrid/icegrid-and-the-administrative-facility#ice.admin.endpoints-for-servers);
remote administrative clients reach these servers through the IceGrid registry, which forwards their requests through
the node.

## Restricting the Facets

[Filtering the facets](../filtering-administrative-facets) removes operations from the admin object for every client
that reaches it.

## See Also

- [Creating the admin Object](../creating-the-admin-object)
- [Filtering Administrative Facets](../filtering-administrative-facets)
- [IceGrid and the Administrative Facility](../../../services/icegrid/icegrid-and-the-administrative-facility)
- [SSL Transport](../../../runtime/ssl-transport)
- [Ice.Admin.\*](../../../property-reference/ice-admin-properties)
