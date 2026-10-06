---
title: Classes
pages:
  - simple-classes
  - class-inheritance
  - self-referential-classes
  - compact-type-ids
  - slice-loaders
  - slicing-values-and-exceptions
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

{% callout type="note" %}

A class represents data that you transmit over the wire, just like a struct. You can't define operations on a Slice
class or implement an interface with a Slice class.

{% /callout %}

## Language Mapping

{% language-section name="mapping" /%}

{% iflang langs="cpp,csharp,java,js,matlab,python,ruby,swift" %}

## Marshaling Hooks

A class instance can update its fields before Ice marshals it, and rebuild local state after Ice unmarshals it:

- Ice calls `ice_preMarshal` on each class instance just before it marshals the fields of this instance.
- Ice calls `ice_postUnmarshal` on each class instance after it has unmarshaled the fields of this instance and set the
  fields that refer to other class instances.

Ice creates an instance with the [Slice loader](./slice-loaders) before it unmarshals the instance's fields, so code
that depends on the received values belongs in `ice_postUnmarshal`, not in a constructor. For Ice to call your hooks on
the instances it unmarshals, install a Slice loader that creates your class for the type ID of the generated class.

{% language-section name="hooks" /%}

{% /iflang %}
