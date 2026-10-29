---
title: Type IDs
---

Every Slice interface, class, and user exception has a type ID: its fully qualified Slice name, which starts with `::`
for the global scope and uses `::` to separate names. For example, the type ID of the `Greeter` interface in the
[Greeter example](../../greeter-example/defining-the-greeter-interface-in-slice) is `::VisitorCenter::Greeter`.

Metadata that renames a mapped type or module does not change its type ID. For example, the Java Greeter example maps
the `VisitorCenter` module to the `com.example.visitorcenter` package, and the type ID of `Greeter` remains
`::VisitorCenter::Greeter`.

When Ice unmarshals a class instance or a user exception, it uses the type ID to find the mapped type to create; see
[Slice Loaders](../user-defined-types/classes/slice-loaders). The `ice_isA`, `ice_id`, and `ice_ids` operations take or
return type IDs; see [Operations on Object](../operations-on-object).

## See Also

- [Operations on Object](../operations-on-object)
- [Slice Loaders](../user-defined-types/classes/slice-loaders)
- [Slicing Values and Exceptions](../user-defined-types/classes/slicing-values-and-exceptions)
