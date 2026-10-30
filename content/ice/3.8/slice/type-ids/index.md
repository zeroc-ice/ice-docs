---
title: Type IDs
---

Every Slice interface, class, and user exception has a type ID: its fully qualified Slice name, starting with `::`. For
example, the type ID of the `Greeter` interface in the
[Greeter example](../../greeter-example/defining-the-greeter-interface-in-slice) is `::VisitorCenter::Greeter`.

Type IDs serve two unrelated purposes:

- A marshaled class instance or user exception carries its type ID, which Ice uses when unmarshaling to create an
  instance of the mapped type; see [Slice Loaders](../user-defined-types/classes/slice-loaders).
- The `ice_isA`, `ice_id`, and `ice_ids` operations take or return the type IDs of interfaces; see
  [Operations on Object](../operations-on-object).

## See Also

- [Operations on Object](../operations-on-object)
- [Slice Loaders](../user-defined-types/classes/slice-loaders)
- [Slicing Values and Exceptions](../user-defined-types/classes/slicing-values-and-exceptions)
