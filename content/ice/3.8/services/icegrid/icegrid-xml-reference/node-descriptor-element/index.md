---
title: "<node> Element"
sidebarLabel: "<node>"
---

A `node` element defines an IceGrid node. The servers that the node is responsible for managing are described in child
elements.

This element may only appear as a child of an [application](../application-descriptor-element) element. Multiple `node`
elements having the same name may appear in an application. Their contents are merged and the last definition of
`load-factor` has precedence.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | **Required** |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `load-factor` | A floating point value by which the registry multiplies the node's load when the adaptive [load balancing](../../load-balancing) policy ranks the nodes of a [replica group](../../object-adapter-replication) from least to most loaded. The node's load is its load average on Linux and macOS, and its CPU utilization on Windows. The default, 1.0 divided by the number of hardware threads on Linux and macOS and 1.0 on Windows, puts both on the same scale: the share of the node's processing capacity in use. A larger factor makes the node rank as more loaded. | No           |
| `name`        | The name must be unique among all nodes in the registry. Within the node, child elements can refer to its name using the [reserved variable](../../using-descriptor-variables-and-parameters) `${node}`. An [icegridnode](../../icegrid-server-reference/icegridnode) process representing this node must be started on the desired computer and its configuration property [IceGrid.Node.Name](../../../../property-reference/icegrid-properties#icegrid.node.name) must match this attribute.                                                                              | Yes          |

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
