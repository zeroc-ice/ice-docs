---
id: type-ids
title: Type IDs
---

Slice interfaces, classes, and user exceptions have an internal type identifier, known as the _type ID_. The type ID is
simply the fully-qualified Slice name of each construct. For example, the type ID of the `Child` interface in the
[preceding example](../forward-declarations) is `::Family::Child`. A type ID starts with a leading `::` and is formed by
starting with the global scope (`::`) and forming the fully-qualified name of a construct by appending each module name
in which the construct is nested, and ending with the name of the construct itself; the components of the type ID are
separated by `::`.

{% callout type="info" %}

The term “type ID” is a historical accident: of the 3 constructs with type IDs, only classes are types in the Slice
language. Neither interfaces nor exceptions are types in Slice.

{% /callout %}

Type IDs are used internally by Ice to unmarshal classes and exceptions. For example, when an exception is thrown, the
marshaled form of the exception that is returned to the client is preceded by its type ID on the wire. The client-side
runtime first reads the type ID and, based on that, unmarshals the remainder of the data as appropriate for the type of
the exception.

Type IDs are also used by the [ice_isA operation](../operations-on-object).

##### See Also

- [ice_isA](../operations-on-object)
