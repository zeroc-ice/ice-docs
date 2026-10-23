---
title: Locator Configuration for a Server
sidebarLabel: Configuration for a Server
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

## Configuring an Object Adapter with a Locator

An [object adapter](../../dispatch) must be able to obtain a [locator](..) proxy in order to register itself with a
location service. Each object adapter can be configured with its own locator proxy by defining its
[Locator](../../../property-reference/object-adapter-properties) property, as shown in the example below for the object
adapter named `SampleAdapter`:

```config
SampleAdapter.Locator=IceGrid/Locator:tcp -h locatorhost -p 10000
```

Alternatively, a server may call `setLocator` on the object adapter prior to activation. If the object adapter is not
explicitly configured with a locator proxy, it uses the [default locator](../locator-configuration-for-a-client) as
provided by its communicator.

Two other configuration properties influence an object adapter's interactions with a location service during activation:

- [AdapterId](../../../property-reference/object-adapter-properties) Configuring a non-empty identifier for the
  `AdapterId` property causes the object adapter to register itself with the location service. A locator proxy must also
  be configured.

- [ReplicaGroupId](../../../property-reference/object-adapter-properties) Configuring a non-empty identifier for the
  `ReplicaGroupId` property indicates that the object adapter is a member of a
  [replica group](../../../basics/terminology). For this property to have an effect, `AdapterId` must also be configured
  with a non-empty value.

We can use these properties as shown below:

```config
SampleAdapter.AdapterId=SampleAdapterId
SampleAdapter.ReplicaGroupId=SampleGroupId
SampleAdapter.Locator=IceGrid/Locator:tcp -h locatorhost -p 10000
```

## Registering a Process with a Locator

An activation service, such as an [IceGrid](../../../services/icegrid) node, requests a graceful shutdown of a server
through the server's [Process facet](../../../administration/administrative-facility/process-facet). IceGrid enables the
[administrative facility](../../../administration/administrative-facility) on the servers that it activates.

The communicator registers the `Process` facet with the location service when it creates the admin object, provided
[Ice.Admin.ServerId](../../../property-reference/ice-admin-properties) is configured and the communicator has a default
locator: it calls `setServerProcessProxy` on the locator registry with the server ID and a proxy for the `Process`
facet. See
[Integrating the Process Facet with an Activation Service](../../../administration/administrative-facility/process-facet#integrating-the-process-facet-with-an-activation-service)
for details.

## See Also

- [Object Adapters](../../dispatch)
- [Locators](..)
- [Locator Configuration for a Client](../locator-configuration-for-a-client)
- [Locator Semantics for Servers](../locator-semantics-for-servers)
- [The Process Facet](../../../administration/administrative-facility/process-facet)
- [Administrative Facility](../../../administration/administrative-facility)
- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid](../../../services/icegrid)
