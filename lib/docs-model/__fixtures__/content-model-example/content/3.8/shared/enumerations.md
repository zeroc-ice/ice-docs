---
id: enumerations
title: Enumerations
description: Defining enumerated types in Slice and how they map to each language.
# languages: [cpp, csharp, java, js, python, swift, matlab, php, ruby]  # default: all
---

## Syntax and semantics

An enumeration is a distinct type with a set of named constants called
enumerators. In Slice you define one with the `enum` keyword:

```slice
enum Fruit { Apple, Pear, Orange }
```

Slice semantics — enumerator ordering, the default value, and wire encoding — are
the same regardless of the programming language you map to. This shared section
explains those semantics once.

{% language-section name="mapping" /%}

## Encoding and versioning

An enumeration is encoded as its enumerator's numeric value. Adding enumerators
at the end is backward-compatible; reordering or removing them is not. This note
is shared across all language mappings.
