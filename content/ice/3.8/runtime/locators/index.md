---
title: Locators
pages:
  - locator-semantics-for-clients
  - locator-configuration-for-a-client
  - locator-semantics-for-servers
  - locator-configuration-for-a-server
---

In [Terminology](../terminology), we described briefly how the Ice runtime uses an intermediary, known as a _location
service_, to convert the symbolic information in an indirect proxy into an endpoint that it can use to communicate with
a server. This section expands on that introduction to explain in more detail how the Ice runtime interacts with a
location service. You can create your own location service or you can use [IceDiscovery](../icediscovery) or
[IceGrid](../icegrid), which are both implementations of a location service. Describing how to implement a location
service is outside the scope of this documentation.

A _locator_ is an Ice object that is implemented by a location service. A locator object must support the Slice
interface `Ice::Locator`, which defines operations that satisfy the location requirements of the Ice runtime.
Applications do not normally use these operations directly, but the locator object may support an
implementation-specific interface derived from `Ice::Locator` that provides additional functionality. For example,
IceGrid's locator object provides access to an `IceGrid::Query` object so that applications can perform
[more sophisticated queries](../well-known-objects).

## See Also

- [Terminology](../terminology)
- [IceDiscovery](../icediscovery)
- [IceGrid](../icegrid)
- [Querying Well-Known Objects](../well-known-objects)
