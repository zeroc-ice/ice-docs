---
id: creating-an-object-adapter
title: Creating an Object Adapter
---

You create an object adapter by calling `createObjectAdapter` on your communicator. For example:

{% language-section name="lang-1" /%}

`createObjectAdapter` creates a new object adapter associated with this communicator. Each object adapter is associated
with zero or more [transport endpoints](../object-adapter-endpoints). Typically, an object adapter has a single
transport endpoint.

{% callout type="info" %}

An object adapter can also offer multiple endpoints. If so, these endpoints each lead to the same set of objects and
represent alternative means of accessing these objects.

An object adapter can also have no endpoint at all. In that case, the adapter can only be reached via collocated
invocations originating from proxies created with the same communicator as the object adapter, or through existing
connections associated with the adapter when the adapter is configured for bidirectional communications.

{% /callout %}

An application normally needs to configure an object adapter with [endpoints](../object-adapter-endpoints) or a
[router](../glacier2). Calling `createObjectAdapter` with a non-empty value for `name` means the new object adapter will
check the communicator's configuration for [properties](../object-adapter-properties), using its name as prefix,
including:

- [_name_.Endpoints](../object-adapter-properties) - defines one or more object adapter endpoints
- [_name_.Router](../object-adapter-properties) - specifies the stringified proxy of a router

If you want to create an object adapter and specify its endpoints in one shot, call `createObjectAdapterWithEndpoints`
is on your communicator. For example:

{% language-section name="lang-2" /%}

##### See Also

- [Communicator](../communicator)
