---
title: Locator Semantics for Servers
---

{% callout type="info" title="JavaScript" %}

An Ice for JavaScript object adapter cannot register with a locator. It does not support the `AdapterId`,
`ReplicaGroupId` and `Locator` properties, and `createObjectAdapter` fails with `PropertyException` if any of them is
set. A JavaScript client can still use a locator to resolve indirect proxies.

{% /callout %}

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
that is [properly configured](../locator-configuration-for-a-server) contacts the locator during activation to supply
its identifier and [published endpoints](../../dispatch/object-adapter-endpoints). More specifically, the object adapter
registers itself with an object implementing the `Ice::LocatorRegistry` interface, whose proxy the object adapter
obtains by calling `getRegistry` on the locator.

## Registering and Unregistering Endpoints

An object adapter registers its endpoints only if it has an adapter identifier, a locator, and at least one published
endpoint, and if `getRegistry` returns a non-null proxy. Otherwise, it activates without registering its endpoints.

The object adapter registers its endpoints when the application calls `activate` on an object adapter that it has not
activated or held before; calling `activate` after `hold` does not register them. When `activate` throws because the
registration failed, the object adapter stays inactive, so the application can call `activate` again.

Calling `setPublishedEndpoints` registers the new endpoints immediately, before or after activation. When
`setPublishedEndpoints` throws because the registration failed, the object adapter keeps its previous published
endpoints.

During deactivation, the object adapter unregisters its endpoints by registering a null proxy with the locator registry.
The object adapter ignores any failure to do so.

## Registration Failures

A location service may require that all object adapters be pre-registered via some implementation-specific mechanism.
([IceGrid](../../../services/icegrid) behaves this way by default.) This implies that registration can fail if the
object adapter supplies an identifier that is unknown to the location service. In such a situation, `activate` or
`setPublishedEndpoints` throws `NotRegisteredException`.

In a similar manner, an object adapter that participates in a [replica group](../../../basics/terminology) includes the
group's identifier when it registers its endpoints. If the location service rejects the replica group identifier,
`activate` or `setPublishedEndpoints` throws `NotRegisteredException` for the replica group. See
[Replica Group Membership](../../../services/icegrid/object-adapter-replication#replica-group-membership) for how
IceGrid assigns object adapters to replica groups.

When the location service reports that endpoints are already registered for the adapter identifier, typically by an
object adapter in another process, `activate` or `setPublishedEndpoints` throws `ObjectAdapterIdInUseException`.

## See Also

- [Object Adapters](../../dispatch)
- [Locator Semantics for Clients](../locator-semantics-for-clients)
- [Locator Configuration for a Server](../locator-configuration-for-a-server)
- [IceGrid](../../../services/icegrid)
- [Terminology](../../../basics/terminology)
- [Object Adapter Replication](../../../services/icegrid/object-adapter-replication)
