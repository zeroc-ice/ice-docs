---
title: Adapter Descriptor Element
---

An `adapter` element defines an indirect [object adapter](../dispatch).

This element may only appear as a child of a [server](../server-descriptor-element) or
[service](../service-descriptor-element) element.

The following attributes are supported:

| **Attribute**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **Required** |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `endpoints`       | Specifies one or more [endpoints](../object-adapter-endpoints) for this object adapter. These endpoints typically do not specify a port. This attribute is translated into a definition of the adapter's [Endpoints](../object-adapter-properties) configuration property                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | No           |
| `id`              | Specifies an object adapter identifier. The identifier must be unique among all adapters and replica groups in the registry. This attribute is translated into a definition of the adapter's [AdapterId](../object-adapter-properties) configuration property. If not defined, a default value is constructed from the adapter name and server ID (and service name for an IceBox [service](../service-descriptor-element)).                                                                                                                                                                                                                                                                                                                       | Yes          |
| `name`            | The name of the object adapter as used in the server that [creates](../creating-an-object-adapter) it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Yes          |
| `priority`        | Specifies the priority of the object adapter as an integer value. The object adapter priority is used by the `Ordered` replica group [load balancing](../load-balancing) policy to determine the order of the endpoints returned by a locate request. Endpoints are ordered from the smallest priority value to the highest. If not defined, the value is 0.                                                                                                                                                                                                                                                                                                                                                                                       | No           |
| `proxy-options`   | The proxy options to use when generating the adapter well-known or allocatable object proxies. This attribute is also translated into a definition of the adapter's [ProxyOptions](../object-adapter-properties) configuration property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | No           |
| `replica-group`   | Specifies a [replica group identifier](../object-adapter-replication). A non-empty value signals that this object adapter is a member of the indicated replica group. This attribute is translated into a definition of the adapter's [ReplicaGroupId](../object-adapter-properties) configuration property. If not defined, the default value is an empty string.                                                                                                                                                                                                                                                                                                                                                                                 | No           |
| `server-lifetime` | A value of `true` indicates that the lifetime of this object adapter is the same as the lifetime of its server. This information is used by the IceGrid node to determine the state of the server. Specifically, the server is considered [activated](../icegrid-server-activation) when all the object adapters with the `server-lifetime` attribute set to `true` are registered with the registry (the object adapter registers itself during activation). Furthermore, server deactivation is considered to begin as soon as one object adapter with the `server-lifetime` attribute set to `true` is unregistered with the registry (the object adapter unregisters itself during deactivation). If not defined, the default value is `true`. | No           |

An optional nested [description](../description-descriptor-element) element provides free-form descriptive text.

Here is an example to demonstrate the use of this element.

```xml
<adapter name="MyAdapter"
    endpoints="default"
    id="MyAdapterId"
    proxy-options="-t -e 1.0"
    replica-group="MyReplicaGroup">
    <description>A description of the adapter.</description>
    ...
</adapter>
```

## See Also

- [Object Adapters](../dispatch)
- [Server Descriptor Element](../server-descriptor-element)
- [Service Descriptor Element](../service-descriptor-element)
- [Object Adapter Endpoints](../object-adapter-endpoints)
- [Object Adapter Replication](../object-adapter-replication)
- [Creating an Object Adapter](../creating-an-object-adapter)
- [Load Balancing](../load-balancing)
- [IceGrid Server Activation](../icegrid-server-activation)
- [Object Adapter Properties](../object-adapter-properties)
