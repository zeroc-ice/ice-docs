---
title: Using the admin Object
---

A program can obtain a proxy for its `admin` object by calling the `getAdmin` operation on a communicator

This method returns a null proxy if the administrative facility is disabled or the application has not created the admin
object with `createAdmin`. The proxy returned by `getAdmin` cannot be used for invoking operations because it refers to
the default facet and, as we mentioned [previously](../the-admin-object), the `admin` object does not support a default
facet. A program must first obtain a proxy to a specific facet for the `admin` object.

To administer a program remotely, somehow you must obtain a proxy for the program's `admin` object. There are several
ways for the administrative client to accomplish this:

- Construct the proxy itself, assuming that it knows the admin object's identity, facets, and endpoints. The format of
  the [stringified proxy](../endpoint-syntax) is as follows: _adminId_ -f _admin-facet_:_admin-endpoints_ The identity,
  represented here by _adminId_, is _instance-name_/admin for admin objects created during communicator initialization
  or with `getAdmin`, where _instance-name_ is the value of the [Ice.Admin.InstanceName](../ice-admin-properties)
  property or a UUID if that property is not defined. (Clearly, the use of a UUID makes the proxy much more difficult
  for a client to construct on its own.) The name of the administrative facet is supplied as the value of the -f option,
  and the endpoints of the object adapter that hosts the admin object appear last in the proxy.
- Invoke an application-specific interface for retrieving the `admin` object's proxy.
- Use the `getServerAdmin` operation on the `IceGrid::Admin` interface, if the remote program was activated by IceGrid
  (see [IceGrid Server Activation](../icegrid-server-activation)).

Having obtained the proxy, the administrative client must select a facet before invoking any operations. For example,
the code below shows how to obtain the configuration properties of the remote program:

{% language-section name="lang-1" /%}

A remote client must also know (or be able to determine) which facets are available in the target server. Typically this
information is statically configured in the client, since the client must also know the interface types of any facets
that it uses. If an invocation on a facet throws `FacetNotExistException`, the client may have used an incorrect facet
name, or the server may have disabled the facet in question.

##### See Also

- [The admin Object](../the-admin-object)
- [Creating the admin Object](../creating-the-admin-object)
- [Ice.Admin.*](../ice-admin-properties)
- [Proxy and Endpoint Syntax](../endpoint-syntax)
