---
title: Allocatable Descriptor Element
---

An allocatable element defines an [allocatable object](../resource-allocation-using-icegrid-sessions) in the IceGrid
registry. Clients can allocate this object using only its identity, or they can allocate objects of a specific type.

This element may only appear as a child of an [adapter](../adapter-descriptor-element) element.

The following attributes are supported:

| **Attribute**   | **Description**                                                                                                                                                                                                | **Required** |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `identity`      | Specifies the identity by which this allocatable object is known.                                                                                                                                              | Yes          |
| `property`      | Specifies the name of a property to generate that contains the stringified identity of this allocatable.                                                                                                       | No           |
| `type`          | An arbitrary string used to group allocatable objects. By convention, the string represents the most-derived Slice [type ID](../type-ids) of the object, but an application is free to use another convention. | No           |
| `proxy-options` | The proxy options to use for the proxy of the allocatable object returned by IceGrid.                                                                                                                          | No           |

## See Also

- [Resource Allocation Using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [Adapter Descriptor Element](../adapter-descriptor-element)
- [Type IDs](../type-ids)
