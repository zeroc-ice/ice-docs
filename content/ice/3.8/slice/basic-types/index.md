---
title: Basic Types
---

## Built-In Basic Types

Slice provides a number of built-in basic types, as shown in this table:

| **Type** | **Range of Mapped Type**                              | **Size of Mapped Type** |
| -------- | ----------------------------------------------------- | ----------------------- |
| `bool`   | `false` or `true`                                     | ≥ 1 bit                 |
| `byte`   | -128 to 127 or 0 to 255                               | ≥ 8 bits                |
| `short`  | -2{% sup %}15{% /sup %} to 2{% sup %}15{% /sup %} - 1 | ≥ 16 bits               |
| `int`    | -2{% sup %}31{% /sup %} to 2{% sup %}31{% /sup %} - 1 | ≥ 32 bits               |
| `long`   | -2{% sup %}63{% /sup %} to 2{% sup %}63{% /sup %} - 1 | ≥ 64 bits               |
| `float`  | IEEE single-precision                                 | ≥ 32 bits               |
| `double` | IEEE double-precision                                 | ≥ 64 bits               |
| `string` | All Unicode characters                                | Variable-length         |

The range of `byte` depends on whether the language mapping uses a signed or an unsigned type for it.

## Integer Types

Slice provides integer types `short`, `int`, and `long`, with 16-bit, 32-bit, and 64-bit ranges, respectively. Note
that, on some architectures, any of these types may be mapped to a native type that is wider. Also note that no unsigned
types are provided. (This choice was made because unsigned types are difficult to map into languages without native
unsigned types, such as Java).

## Floating-Point Types

These types follow the IEEE specification for single- and double-precision floating-point representation
[\[1\]](#references). If an implementation cannot support IEEE format floating-point values, the Ice runtime converts
values into the native floating-point representation (possibly at a loss of precision or even magnitude, depending on
the capabilities of the native floating-point format).

## Strings

Slice strings use the Unicode character set and are encoded using UTF-8 when transmitted between clients and servers.

## Booleans

Boolean values can have only the values `false` and `true`. Language mappings use the corresponding native boolean type
if one is available.

## Bytes

The Slice type `byte` is an 8-bit type. A `sequence<byte>` carries binary data unchanged.

## Language Mapping

{% language-section name="mapping" /%}

## References

1. Institute of Electrical and Electronics Engineers. 1985. _IEEE 754-1985 Standard for Binary Floating-Point
   Arithmetic_. Piscataway, NJ: Institute of Electrical and Electronic Engineers.
