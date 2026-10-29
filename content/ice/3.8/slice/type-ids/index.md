---
title: Type IDs
---

Every Slice interface, class, and user exception has a type ID: its fully qualified Slice name, which starts with `::`
for the global scope and uses `::` to separate names. For example, the type ID of the `Child` interface in the
[Family example](../forward-declarations) is `::Family::Child`.

Metadata that renames a mapped type or module, such as `cs:identifier`, does not change its type ID.

When Ice unmarshals a class instance or a user exception, it uses the type ID to find the mapped type to create; see
[Slice Loaders](../user-defined-types/classes/slice-loaders). The `ice_isA`, `ice_id`, and `ice_ids` operations take or
return type IDs; see [Operations on Object](../operations-on-object).

## See Also

- [Operations on Object](../operations-on-object)
- [Slice Loaders](../user-defined-types/classes/slice-loaders)
- [Slicing Values and Exceptions](../user-defined-types/classes/slicing-values-and-exceptions)
