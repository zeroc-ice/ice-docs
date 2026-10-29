---
title: Operations on Object
---

Every Slice interface derives from `Object`
([Implicit Inheritance from Object](../interfaces/interface-inheritance#implicit-inheritance-from-object)), which
provides four idempotent operations. You call them on any proxy, like the operations of your own interfaces:

| Operation                                | Description                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`ice_ping`](api:Ice/ObjectPrx.ice_ping) | Tests whether the target object can be reached.                                                       |
| [`ice_isA`](api:Ice/ObjectPrx.ice_isA)   | Tests whether the target object implements the Slice interface with the given [type ID](../type-ids). |
| [`ice_id`](api:Ice/ObjectPrx.ice_id)     | Returns the type ID of the most-derived Slice interface the target object implements.                 |
| [`ice_ids`](api:Ice/ObjectPrx.ice_ids)   | Returns the type IDs of all the Slice interfaces the target object implements, in alphabetical order. |

## See Also

- [Type IDs](../type-ids)
- [Interface Inheritance](../interfaces/interface-inheritance)
