---
title: Node Descriptor Element
---

A `node` element defines an IceGrid node. The servers that the node is responsible for managing are described in child
elements.

This element may only appear as a child of an [application](../application-descriptor-element) element. Multiple `node`
elements having the same name may appear in an application. Their contents are merged and the last definition of
`load-factor` has precedence.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **Required** |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `load-factor` | A floating point value defining the factor that is multiplied with the node's load average. The load average is used by the adaptive [load balancing](../../load-balancing) policy to figure out which node is the least loaded. The default is `1.0` on Unix platforms and `1/NCPUS` on Windows (where `NCPUS` is the number of CPUs in the node's computer). Note that, if Unix and Windows machines are part of a [replica group](../../object-adapter-replication), the Unix and Windows figures are not directly comparable, but the registry still makes an attempt to pick the least-loaded node. | No           |
| `name`        | The name must be unique among all nodes in the registry. Within the node, child elements can refer to its name using the [reserved variable](../../using-descriptor-variables-and-parameters) `${node}`. An [icegridnode](../../icegrid-server-reference/icegridnode) process representing this node must be started on the desired computer and its configuration property [IceGrid.Node.Name](../../../../property-reference/icegrid-properties) must match this attribute.                                                                                                                            | Yes          |

Here is an example to demonstrate the use of this element:

```xml
<node name="Node1" load-factor="2.0">
    <description>A description of this node.</description>
    <server id="Server1" ...>
        <property name="NodeName" value="${node}"/>
        ...
    </server>
</node>
```

## See Also

- [Application Descriptor Element](../application-descriptor-element)
- [Load Balancing](../../load-balancing)
- [Object Adapter Replication](../../object-adapter-replication)
- [icegridnode](../../icegrid-server-reference/icegridnode)
