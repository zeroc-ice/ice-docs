---
title: Dictionaries
---

## Dictionary Syntax and Semantics

A dictionary is a mapping from a key type to a value type.

For example:

```slice
module M
{
    struct Employee
    {
        long   number;
        string firstName;
        string lastName;
    }

    dictionary<long, Employee> EmployeeMap;
}
```

This definition creates a dictionary named `EmployeeMap` that maps from an employee number to a structure containing the
details for an employee.

## Allowable Types for Dictionary Keys and Values

The value type of a dictionary can be any Slice type. However, the key type of a dictionary is limited to one of the
following types:

- [Integral](../../basic-types) types (`short`, `int`, `long`)
- [bool](../../basic-types)
- [byte](../../basic-types)
- [string](../../basic-types)
- [enum](../enumerations)
- [Structures](../structures) containing only fields of legal key types

Other complex types, such as dictionaries, and floating-point types (`float` and `double`) cannot be used as the key
type. Complex types are disallowed because they complicate the language mappings for dictionaries, and floating-point
types are disallowed because representational changes of values as they cross machine boundaries can lead to ill-defined
semantics for equality.

## Language Mapping

{% language-section name="mapping" /%}
