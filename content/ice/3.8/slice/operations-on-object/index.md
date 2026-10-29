---
title: Operations on Object
---

Every Slice interface derives from `Object`
([Implicit Inheritance from Object](../interfaces/interface-inheritance#implicit-inheritance-from-object)). `Object` is
a Slice keyword, so you cannot define it in Slice; this is what its definition would look like if you could:

```slice
sequence<string> StringSeq;

interface Object // pseudo-Slice: Object is a keyword
{
    idempotent void ice_ping();
    idempotent bool ice_isA(string typeId);
    idempotent string ice_id();
    idempotent StringSeq ice_ids();
}
```

The four operations are standard Slice operations, mapped with the standard mapping rules. You call them on any proxy,
like the operations of your own interfaces:

| Operation                                | Description                                                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`ice_ping`](api:Ice/ObjectPrx.ice_ping) | Tests whether the target object can be reached.                                                                               |
| [`ice_isA`](api:Ice/ObjectPrx.ice_isA)   | Tests whether the target object implements the Slice interface with the given [type ID](../type-ids); `checkedCast` calls it. |
| [`ice_id`](api:Ice/ObjectPrx.ice_id)     | Returns the type ID of the most-derived Slice interface the target object implements.                                         |
| [`ice_ids`](api:Ice/ObjectPrx.ice_ids)   | Returns the type IDs of all the Slice interfaces the target object implements, in alphabetical order.                         |

## See Also

- [Type IDs](../type-ids)
- [Interface Inheritance](../interfaces/interface-inheritance)
