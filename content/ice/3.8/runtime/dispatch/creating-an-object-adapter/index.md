---
title: Creating an Object Adapter
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

You create an object adapter by calling `createObjectAdapter` on a communicator:

{% language-section name="create" /%}

The object adapter reads its configuration from the [properties](../../../property-reference/object-adapter-properties)
prefixed with its name, including:

{% iflang langs="cpp,csharp,java,python,swift" %}

- [_name_.Endpoints](../../../property-reference/object-adapter-properties#adapter.endpoints), the
  [endpoints](../object-adapter-endpoints) on which the object adapter listens;
- [_name_.Router](../../../property-reference/object-adapter-properties#adapter.router), the proxy of a
  [router](../../invocation/routers).

{% /iflang %}

{% iflang langs="js" %}

- [_name_.Router](../../../property-reference/object-adapter-properties#adapter.router), the proxy of a
  [router](../../invocation/routers).

{% /iflang %}

When you call `createObjectAdapter` with a non-empty name, set at least one property prefixed with this name. With an
empty name, the object adapter reads no properties.

{% iflang langs="cpp,csharp,java,python,swift" %}

`createObjectAdapterWithEndpoints` creates an object adapter and sets its endpoints:

{% /iflang %}

{% language-section name="create-with-endpoints" /%}

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter without endpoints dispatches only collocated invocations and the requests it receives over
[bidirectional connections](../../connection-management/bidirectional-connections).

{% /iflang %}

## See Also

- [Communicator](../../communicator)
- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
