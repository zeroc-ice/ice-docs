---
title: The Active Servant Map
sidebarLabel: Active Servant Map
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

Each object adapter maintains an _active servant map_ (ASM): a table that maps the identity and facet of an Ice object
to the servant that handles its requests. The [dispatch pipeline](../dispatch-pipeline) looks up the identity and facet
of each request in the ASM, and dispatches the request to the servant it finds there; otherwise, it looks for a
[default servant](../default-servants).

![The client proxy contains endpoint 212.8.7.33 and identity Joe. The request reaches the server object adapter, whose active servant map associates Fred, Joe, and Carl with servants. The highlighted Joe entry selects the matching servant.](/images/ice/3.8/active-servant-map/binding-request-to-servant.svg)

_Dispatching a request to the correct servant._

## Adding and Removing Servants

The object adapter provides the following methods to manage its ASM:

- [`add`](api:Ice/ObjectAdapter.add) adds a servant with the given identity and the default facet, and returns a proxy
  with this identity.
- [`addWithUUID`](api:Ice/ObjectAdapter.addWithUUID) does the same with a UUID as the identity; `ice_getIdentity` on the
  returned proxy gives this identity.
- [`remove`](api:Ice/ObjectAdapter.remove) removes the entry for the given identity and the default facet, and returns
  its servant. Dispatches already in progress in the servant complete normally.

Each identity and facet has at most one servant, but you can add the same servant with several identities.
[`addFacet`](api:Ice/ObjectAdapter.addFacet), [`addFacetWithUUID`](api:Ice/ObjectAdapter.addFacetWithUUID) and
[`removeFacet`](api:Ice/ObjectAdapter.removeFacet) do the same for a [facet](../../facets) other than the default one.
Destroying the [object adapter](../object-adapter-activation-and-deactivation) empties its ASM.

{% iflang langs="cpp,csharp,java,js,swift" %}

The ASM holds [dispatchers](../dispatcher-api): a servant is the usual one, but you can add any dispatcher.

{% /iflang %}

## See Also

- [Default Servants](../default-servants)
