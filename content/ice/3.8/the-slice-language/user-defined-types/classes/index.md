---
title: Classes
---

A class is a user-defined type that holds a list of fields, just like a struct. Classes also offer capabilities not
offered by structs:

- Extensibility You can extend a class through inheritance and optional fields
- Graph preservation You can transmit a graph of class instances through a Slice operation
- Null/not-set value A class parameter or field can be null or not-set, whereas a struct parameter or field must have a
  value
- Slicing A recipient can unmarshal a class instance into a base class by slicing off derived "slices" it does not know

These extra capabilities are not free: the marshaling/unmarshaling of a class is much more complex and time consuming
than the marshaling/unmarshaling of a struct, and its binary representation is larger. As a result, you should only
select a class over a struct when these extra capabilities may be useful for your application.

{% callout type="info" %}

A class represents data that you transmit over the wire, just like a struct. You can't define operations on a Slice
class or implement an interface with a Slice class.

{% /callout %}

## Language Mapping

{% language-section name="language-mapping" /%}
