---
title: Replica Group Descriptor
---

A replica group represents an abstract grouping of identical, or very similar, object adapters. An object adapter joins
this group by setting this replica group ID in its Replica Group field.

## Properties

The Replica Properties panel offers the following fields:

- **Replica Group ID** The ID of this replica group. Must be unique within an IceGrid deployment.
- **Description** A free-text description of this replica group.
- **Proxy** **Options** The default Proxy Options for well-known objects defined within this replica group.

- **Well-known Objects** A table of well-known objects defined by this replica group.
- **Load Balancing Policy** The load-balancing policy used by IceGrid when resolving the Replica Group ID in proxies.
  Must be one of:

| **Policy**  | **Description**                                                                                                                                                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adaptive    | Returns the endpoints of the object adapters whose nodes report the lowest load-average (on Linux/Unix) or CPU utilization (on Windows). The actual load-average or CPU utilization value of each node is multiplied by the node's load-factor for this comparison. See Load Sample below, and [Node](../node-descriptor). |
| Ordered     | Returns the endpoints of the object adapters with the highest priority. See [Adapter](../adapter-descriptor).                                                                                                                                                                                                              |
| Random      | Returns the endpoints of object adapters selected at random. This is the default policy.                                                                                                                                                                                                                                   |
| Round-robin | IceGrid puts all the object adapters in a list, and for each new resolution, it returns the endpoints from the next _How many Adapters_ items on this list.                                                                                                                                                                |

- **How many Adapters** Specify the number of object adapters selected by IceGrid for each resolution. 1 is a common
  value. When set to 0 (the default), IceGrid returns the endpoints of all object adapters in this replica group.
- **Load Sample** Available only with the Adaptive load-balancing policy. Specify the load-average or CPU utilization
  sample to use when comparing nodes: it can be 1 (default), 5 or 15 minutes.
