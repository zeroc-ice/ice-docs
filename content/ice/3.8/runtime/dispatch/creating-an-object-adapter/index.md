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

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter with a non-empty name reads its configuration from the
[properties](../../../property-reference/object-adapter-properties) prefixed with this name, such as
[_name_.Endpoints](../../../property-reference/object-adapter-properties#adapter.endpoints), the
[endpoints](../object-adapter-endpoints) on which it listens. It requires at least one of these properties. An object
adapter with an empty name reads no properties.

{% /iflang %}

{% iflang langs="js" %}

An object adapter with a non-empty name reads its configuration from the
[properties](../../../property-reference/object-adapter-properties) prefixed with this name, such as
[_name_.Router](../../../property-reference/object-adapter-properties#adapter.router), the proxy of a
[router](../../invocation/routers). It requires at least one of these properties. An object adapter with an empty name
reads no properties.

{% /iflang %}

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
