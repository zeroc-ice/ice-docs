---
title: Load-Balancing Descriptor Element
---

A `load-balancing` element determines the [load balancing](../../load-balancing) policy used by a
[replica group](../../object-adapter-replication).

This element may only appear as a child of a [replica-group](../replica-group-descriptor-element) element.

The following attributes are supported:

| **Attribute** | **Description**                                                                                                                                                                                                                                          | **Required** |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `load-sample` | Specifies the load sample to use for the adaptive load balancing policy: the node's load averaged over the last `1`, `5` or `15` minutes. It can only be defined if `type` is set to `adaptive`. If not specified, the load sample default value is `1`. | No           |
| `n-replicas`  | Specifies the maximum number of replicas whose endpoints the registry returns to a client that resolves an indirect proxy with this replica group ID. A value of `0` selects all the replicas. If not specified, the default value is `1`.               | No           |
| `type`        | Specifies the type of load balancing. Legal values are `adaptive`, `ordered`, `round-robin` and `random`.                                                                                                                                                | Yes          |

Here is an example to demonstrate the use of this element:

```xml
<application name="MyApp">
    <replica-group id="ReplicatedAdapter">
        <load-balancing type="adaptive" load-sample="15" n-replicas="3"/>
        <description>A description of this replica group.</description>
        <object identity="WellKnownObject" .../>
    </replica-group>
    ...
</application>
```

## See Also

- [Load Balancing](../../load-balancing)
- [Object Adapter Replication](../../object-adapter-replication)
- [Replica-Group Descriptor Element](../replica-group-descriptor-element)
