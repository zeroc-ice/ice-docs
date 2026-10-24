---
title: "<adapter> Element"
sidebarLabel: "<adapter>"
---

An `adapter` element defines an indirect [object adapter](../../../../runtime/dispatch).

This element may only appear as a child of a [server](../server-descriptor-element) or
[service](../service-descriptor-element) element.

The following attributes are supported:

| **Attribute**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Required** |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `endpoints`       | Specifies the [endpoints](../../../../runtime/dispatch/object-adapter-endpoints) of this object adapter. Use a single endpoint, with an IP address rather than a DNS name if it specifies a host. When the endpoint does not specify a port, the operating system selects an ephemeral port when the server creates the adapter. IceGrid sets the adapter's [Endpoints](../../../../property-reference/object-adapter-properties) property to this value, or to `default` if not defined. | No           |
| `id`              | Specifies the adapter ID. The adapter ID must be unique among all adapters and replica groups in the registry. IceGrid sets the adapter's [AdapterId](../../../../property-reference/object-adapter-properties) property to this value. If not defined, IceGrid uses `${server}.<name>`, or `${server}.${service}.<name>` for an adapter defined in an IceBox [service](../service-descriptor-element), where `<name>` is the adapter's `name` attribute.                                 | No           |
| `name`            | The name of the object adapter as used in the server that [creates](../../../../runtime/dispatch/creating-an-object-adapter) it.                                                                                                                                                                                                                                                                                                                                                          | Yes          |
| `priority`        | Specifies the priority of the object adapter as an integer value. The object adapter priority is used by the `Ordered` replica group [load balancing](../../load-balancing) policy to determine the order of the endpoints returned by a locate request. Endpoints are ordered from the smallest priority value to the highest. If not defined, the value is `0`.                                                                                                                         | No           |
| `proxy-options`   | The proxy options to use when generating the adapter well-known or allocatable object proxies. IceGrid also sets the adapter's [ProxyOptions](../../../../property-reference/object-adapter-properties) property to this value.                                                                                                                                                                                                                                                           | No           |
| `replica-group`   | Specifies a [replica group ID](../../object-adapter-replication). A non-empty value signals that this object adapter is a member of the indicated replica group. IceGrid sets the adapter's [ReplicaGroupId](../../../../property-reference/object-adapter-properties) property to this value. If not defined, the default value is an empty string.                                                                                                                                      | No           |
| `server-lifetime` | A value of `true` indicates that the lifetime of this object adapter is the same as the lifetime of its server. The IceGrid node uses these object adapters to determine when the server is [activated](../../icegrid-server-activation) and when its deactivation begins. If not defined, the default value is `true`.                                                                                                                                                                   | No           |

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

- [Object Adapters](../../../../runtime/dispatch)
- [Server Descriptor Element](../server-descriptor-element)
- [Service Descriptor Element](../service-descriptor-element)
- [Object Adapter Endpoints](../../../../runtime/dispatch/object-adapter-endpoints)
- [Object Adapter Replication](../../object-adapter-replication)
- [Creating an Object Adapter](../../../../runtime/dispatch/creating-an-object-adapter)
- [Load Balancing](../../load-balancing)
- [IceGrid Server Activation](../../icegrid-server-activation)
- [Object Adapter Properties](../../../../property-reference/object-adapter-properties)
