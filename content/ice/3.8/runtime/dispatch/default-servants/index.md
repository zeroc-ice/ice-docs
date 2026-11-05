---
title: Default Servants
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

A _default servant_ is a servant that dispatches the requests for many Ice objects: for each request, it acts as the Ice
object whose [identity](../../object-identity) the request carries. One default servant can implement any number of Ice
objects, such as one per record of a database, without a servant in memory for each of them.

## Registering a Default Servant

[`addDefaultServant`](api:Ice/ObjectAdapter.addDefaultServant) registers a default servant for a category, and
[`removeDefaultServant`](api:Ice/ObjectAdapter.removeDefaultServant) removes the default servant of a category and
returns it. Each category has at most one default servant, but you can register the same servant for several categories.

When the [active servant map](../active-servant-map) has no servant for the identity and facet of a request, the
[dispatch pipeline](../dispatch-pipeline) dispatches the request to the default servant registered for the category of
the identity, or else to the default servant registered for the empty category. A default servant receives these
requests whatever their facet.

{% iflang langs="cpp,csharp,java,js,swift" %}

The object adapter accepts any [dispatcher](../dispatcher-api) as a default servant.

{% /iflang %}

## Implementing a Default Servant

A default servant finds the target Ice object from the identity in the `Current` object of each request. The `name` of
the identity typically holds everything it needs, such as the key of a database record. Clients don't need to know that
a default servant implements the Ice object, so don't add operation parameters for this purpose.

The object adapter can dispatch requests for different Ice objects to a default servant concurrently, as described in
[The Ice Threading Model](../../threading-model). To avoid contention between these dispatches, a default servant keeps
no state of its own for these objects: each dispatch reads the state of its Ice object, for example from the database,
and works on local data.

All the Ice objects that a default servant implements have the same interface. To implement several interfaces with
default servants, use one category per interface, such as `Sensor` and `Switch`, and register a default servant for each
category. Using a non-empty category from the start makes it easier to add a default servant for another interface
later.

When the identity of a request names an Ice object that doesn't exist, the default servant throws
`ObjectNotExistException`.

## See Also

- [The Active Servant Map](../active-servant-map)
- [Object Identity](../../object-identity)
- [The Ice Threading Model](../../threading-model)
