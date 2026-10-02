---
title: Fields
---

## Syntax

A field is defined as `Type name`, where `Type` is the field's type and `name` is the field's name. For example:

```slice
string name;
ByteSeq image;
Fruit fruit;
```

Each field definition must be followed by a semicolon. You can define several fields on the same line if you wish, as
in:

```slice
struct Point { int x; int y; }
```

The type of a field can be a [basic type](../basic-types), a [user-defined type](../user-defined-types), `Object*` (an
untyped proxy), or `Value`(an untyped class instance).

## Nullable and Non-Nullable Fields

Fields with proxy and class types are nullable. Optional fields (presented below) are also nullable. All other fields
are non-nullable, meaning they must have a value when transmitted through Ice.

```slice
struct Example
{
    int count; // must be set
    Greeter* greeter; // proxy type, so it can be null
    Node node; // class type, so it can be null
}
```

## Optional Fields

A field of a Slice [class](../user-defined-types/classes) or [exception](../exceptions) may be declared as optional to
indicate that a program can leave its value unset. Fields not declared as optional are known as _required_ fields; a
program must supply legal values for all required fields.

Each optional field must be assigned a unique, non-negative integer _tag_:

```slice
module M
{
    class C
    {
        string name;
        bool active;
        optional(2) string alternateName;
        optional(5) int overrideCode;
    }
}
```

It is legal for a base type's tag to be reused by a derived type:

```slice
exception BaseException
{
    optional(1) int systemCode;
}

exception DerivedException extends BaseException
{
    optional(1) string diagnostic; // OK
}
```

The scope of a tag is limited to its enclosing type and has no effect on base or derived types.

{% callout type="warning" %}

You can mark any field as optional, except if the field’s type is a class type or a constructed type that holds a class
type. At the field level, optional and class are incompatible.

{% /callout %}

Optional fields and required fields can appear in any order in your class definition. You can also assign tags in any
order. For example:

```slice
class UnusualButValidPerson
{
    optional(5) string nickname;
    string name;
    optional(0) Date dateOfBirth; // Date is a struct
    string currentAddress;
    optional(123) Fruit favoriteFruit; // Fruit is an enum
}
```

## Default Values

You can specify a default value for a field that has one of the following types:

- An [integral](../basic-types) type (`byte`, `short`, `int`, `long`)
- A [floating point](../basic-types) type (`float` or `double`)
- [string](../basic-types)
- [bool](../basic-types)
- [enum](../user-defined-types/enumerations)

For example:

```slice
struct Location
{
    string name;
    Point pt;
    bool display = true;
    string source = "GPS";
}
```

The legal syntax for literal values is the same as for Slice [constants](../constants-and-literals), and you may also
use a constant as a default value. The language mapping guarantees that fields are initialized to their declared default
values using a language-specific mechanism.

You can declare a default value for optional fields just as you can for required fields:

```slice
class C
{
    string name;
    bool active = true;
    optional(2) string alternateName;
    optional(5) int overrideCode = -1;
}
```

An optional field with a default value is considered to be set by default.

## Language Mapping

{% language-section name="lang-1" /%}

{% language-section name="lang-2" /%}
