---
title: Classes
pages:
  - class-inheritance
  - self-referential-classes
  - compact-type-ids
  - slice-loaders
  - slicing-values-and-exceptions
---

A class is a user-defined type that holds a list of fields, like a [struct](../structures). You define a class with the
`class` keyword:

```slice
module M
{
    class TimeOfDay
    {
        short hour;         // 0 - 23
        short minute;       // 0 - 59
        short second;       // 0 - 59
    }
}
```

Classes offer capabilities that structs do not:

- **Extensibility** You can extend a class through [inheritance](./class-inheritance) and
  [optional fields](../../fields#optional-fields).
- **Graph preservation** Ice preserves the references between class instances: two references to the same instance still
  refer to one instance after unmarshaling, and a [class graph](./self-referential-classes) can contain cycles.
- **Null value** A class parameter or field can be null. A struct parameter or field always holds a value, unless it is
  an [optional parameter](../../operations#optional-parameters-and-return-values) or
  [optional field](../../fields#optional-fields) that is not set.
- **Slicing** With the [sliced format](./slicing-values-and-exceptions#slice-formats), a receiver can unmarshal an
  instance of a derived class it does not know as the most-derived base class it knows.

Unlike a struct, a class can be empty. You can use a class wherever you can use a struct, except as a
[dictionary key type](../dictionaries#allowable-types-for-dictionary-keys-and-values) or as the type of an optional
parameter, return value, or field. The fields of a class can have [default values](../../fields#default-values).

Marshaling a class takes more time and space than marshaling a struct, so use a class only when you need one of these
capabilities.

{% callout type="note" %}

A class represents data that you transmit over the wire, just like a struct. You can't define operations on a Slice
class or implement an interface with a Slice class.

{% /callout %}

## Language Mapping

{% language-section name="mapping" /%}
