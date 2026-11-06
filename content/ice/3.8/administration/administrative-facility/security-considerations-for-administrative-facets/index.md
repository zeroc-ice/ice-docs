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

A client that can reach the [admin object](../admin-object) can use all of its facets: it can read and change every
property of the communicator, passwords included, through the `Properties` facet, and shut down the server through the
`Process` facet. The administrative facility is [disabled by default](../creating-the-admin-object); when you enable it,
restrict which clients can reach the admin object and which facets it exposes.

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

To accept only some of these clients,
[IceSSL.TrustOnly.Server.Ice.Admin](../../../property-reference/icessl-properties#icessl.trustonly.server.adaptername)
lists the distinguished names of the certificates that the `Ice.Admin` object adapter accepts, for example:

```config
IceSSL.TrustOnly.Server.Ice.Admin=O=Acme\, Inc.,OU=Administrators
```

{% iflang langs="cpp,csharp,java" %}

When the admin object needs an SSL configuration different from the communicator's, such as a certificate authority
trusted only for administrative clients, host it in an object adapter that you create with its own server authentication
options, as described in
[Hosting the admin Object in Your Own Object Adapter](../creating-the-admin-object#hosting-the-admin-object-in-your-own-object-adapter).
`IceSSL.VerifyPeer` does not apply to this object adapter, so these options must require a client certificate
themselves.

{% /iflang %}

By default, [IceGrid](../../../services/icegrid) enables the administrative facility in the servers that it activates
and
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
