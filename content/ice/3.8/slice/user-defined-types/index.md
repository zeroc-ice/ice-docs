---
title: User-Defined Types
pages:
  - enumerations
  - structures
  - classes
  - sequences
  - dictionaries
---

Besides its [basic types](../basic-types), Slice lets you define the types of the data that your operations exchange:

- An [enumeration](./enumerations) is a type with a fixed set of named values, such as
  `enum Fruit { Apple, Pear, Orange }`.
- A [structure](./structures) groups named fields, such as the hour, minute, and second of a time of day.
- A [class](./classes) groups named fields like a structure, and also supports inheritance, optional fields, null
  values, and graphs of instances.
- A [sequence](./sequences) is a variable-length list of elements of the same type.
- A [dictionary](./dictionaries) maps keys of one type to values of another type.

You can combine these types: a structure can hold a sequence, and a dictionary can map keys to structures.

Use a structure rather than a class unless you need one of the capabilities of classes: a class instance takes more time
to marshal and unmarshal, and more space on the wire, than a structure with the same fields.
