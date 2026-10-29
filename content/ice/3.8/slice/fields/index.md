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

The type of a field can be a [basic type](../basic-types), a [user-defined type](../user-defined-types), `Object*` (an
untyped proxy), or `Value` (an untyped class instance).

## Nullable and Non-Nullable Fields

Fields with proxy and class types are nullable: they can hold null. Fields of other types always hold a value, unless
they are [optional fields](#optional-fields) that are not set.

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
indicate that a program can leave its value unset. Fields not declared as optional are known as _required_ fields.

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

The scope of a tag is the class or exception that defines the field, and this class or exception only: a derived class
or exception can reuse a tag of its base type. For example:

```slice
exception BaseException
{
    optional(1) int systemCode;
}

exception DerivedException extends BaseException
{
    optional(1) string diagnostic; // OK: a different scope
}
```

Optional and required fields can be interleaved, and their tags can be in any order. The tag identifies the field in the
[encoding](../../encoding/data-encoding-for-optional-values); the language mappings do not expose it.

An optional field cannot have a class type, or a constructed type that holds a class type.

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

{% language-section name="language-mapping-1" /%}

{% language-section name="language-mapping-2" /%}
