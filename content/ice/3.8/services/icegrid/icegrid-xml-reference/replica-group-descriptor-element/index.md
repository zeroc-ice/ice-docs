---
title: Replica-Group Descriptor Element
---

A `replica-group` element creates a virtual object adapter in order to provide
[replication](../object-adapter-replication) and [load balancing](../load-balancing) for a collection of object
adapters. An [adapter](../adapter-descriptor-element) element declares its membership in a group by identifying the
desired replica group. The element may declare [well-known objects](../well-known-objects) that are available in all of
the participating object adapters. A `replica-group` element may contain a `load-balancing` child element that specifies
the load-balancing algorithm the registry should use when resolving locate requests. If not specified, the registry uses
a random load balancing policy with the number of replicas set to 0.

This element may only appear as a child of an [application](../application-descriptor-element) element.

The following attributes are supported:

| **Attribute**   | **Description**                                                                                                                                                                                               | **Required** |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `id`            | Specifies the identifier of the replica group, which must be unique among all adapters and replica groups in the registry. This identifier can be used in indirect proxies in place of an adapter identifier. | Yes          |
| filter          | Specifies the identifier of a replica group filter that performs [custom load balancing](../load-balancing).                                                                                                  | No           |
| `proxy-options` | The proxy options to use for well-known object proxies declared with this replica group.                                                                                                                      | No           |

An optional nested [description](../description-descriptor-element) element provides free-form descriptive text.

Here is an example to demonstrate the use of this element:

```xml
<application name="MyApp">
    <replica-group id="ReplicatedAdapter"
                   filter="myCustomFilter"
                   proxy-options="-e 1.0">
        <load-balancing type="adaptive" load-sample="15" n-replicas="3"/>
        <description>A description of this replica group.</description>
        <object identity="WellKnownObject" .../>
    </replica-group>
    ...
</application>
```

In this example, the proxy `WellKnownObject` is equivalent to the proxy `WellKnownObject@ReplicatedAdapter`.

##### See Also

- [Object Adapter Replication](../object-adapter-replication)
- [Load Balancing](../load-balancing)
- [Adapter Descriptor Element](../adapter-descriptor-element)
- [Application Descriptor Element](../application-descriptor-element)
- [Description Descriptor Element](../description-descriptor-element)
- [Well-Known Objects](../well-known-objects)
