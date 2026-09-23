---
title: Simple Classes
---

A Slice class definition is similar to a structure definition, but uses the `class` keyword. For example:

```slice
module M
{
    class TimeOfDay
    {
        short hour;         // 0 - 23
        short minute;       // 0 - 59
        short second;       // 0 - 59
    }
}
```

Apart from the keyword `class`, this definition is identical to the [structure](../structures) example. You can use a
Slice class wherever you can use a Slice structure (but, for performance reasons, you should not use a class where a
structure is sufficient). Unlike structures, classes can be empty:

```slice
class EmptyClass {}    // OK
struct EmptyStruct {}  // Error
```

A class can define any number of fields, including [optional fields](../fields). You can also specify a default value
for a field if its type is one of the following:

- An [integral](../basic-types) type (`byte`, `short`, `int`, `long`)
- A [floating point](../basic-types) type (`float` or `double`)
- [string](../basic-types)
- [bool](../basic-types)
- [enum](../enumerations)

For example:

```slice
class Location 
{
    string name;
    Point pt;
    bool display = true;
    string source = "GPS";
}
```

The legal syntax for literal values is the same as for [Slice constants](../constants-and-literals), and you may also
use a constant as a default value. The language mapping guarantees that fields are initialized to their declared default
values using a language-specific mechanism.

##### See Also

- [Structures](../structures)
- [Constants and Literals](../constants-and-literals)
- [Fields](../fields)
