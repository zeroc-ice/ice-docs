---
title: Locator Semantics for Servers
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

A location service must know the endpoints of any [object adapter](../../dispatch) whose identifier can be used in an
indirect proxy. For example, suppose a client uses the following proxy:

```text
Object1@PublicAdapter
```

The communicator in the client includes the identifier `PublicAdapter` in its
[locate request](../locator-semantics-for-clients) and expects to receive the associated endpoints. The only way the
location service can know these endpoints is if it is given them. When you consider that an object adapter's endpoints
may not specify fixed ports, and therefore the endpoint addresses may change each time the object adapter is activated,
it is clear that the best source of endpoint information is the object adapter itself. As a result, an object adapter
that is [properly configured](../locator-configuration-for-a-server) registers its adapter ID, its replica group ID when
it has one, and its [published endpoints](../../dispatch/object-adapter-endpoints) with the locator registry during
activation. The locator registry is an `Ice::LocatorRegistry` whose proxy the object adapter obtains by calling
`getRegistry` on the locator.

## Registering and Unregistering Endpoints

An object adapter registers with the locator registry when it has an adapter ID and a locator, and publishes at least
one endpoint. It registers the first time you call `activate`; calling `activate` after `hold` does not register it
again. Calling `setPublishedEndpoints` registers the new endpoints right away, whether or not the object adapter is
active. Deactivating the object adapter unregisters its endpoints.

## See Also

- [Object Adapters](../../dispatch)
- [Locator Semantics for Clients](../locator-semantics-for-clients)
- [Locator Configuration for a Server](../locator-configuration-for-a-server)
- [IceGrid](../../../services/icegrid)
- [Terminology](../../../basics/terminology)
- [Object Adapter Replication](../../../services/icegrid/object-adapter-replication)
