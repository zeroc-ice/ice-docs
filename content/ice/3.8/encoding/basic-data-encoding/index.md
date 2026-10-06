---
title: Basic Data Encoding
---

## Encoding for Sizes

The Ice encoding uses a compact representation, called a `size`, for most of the counts that appear in encoded data,
such as the number of elements of a sequence or the number of bytes of a string. A `size` is an integer in the range 0
to 2³¹−1, encoded in one of two forms:

1. A single byte that encodes the `size` for values from 0 to 254.
2. A single byte set to `255`, followed by an `int` that encodes the `size` (5 bytes total).

The single-byte form is for a `size` below 255; the five-byte form is accepted for any `size`.

Using this encoding to indicate sizes is significantly cheaper than always using an `int` to store the size, especially
when marshaling sequences of short strings: sizes of up to 254 fit in a single byte instead of four. This comes at the
expense of sizes greater than 254, which require five bytes instead of four. However, for sequences or strings of length
greater than 254, the extra byte is insignificant.

## Encoding for Encapsulations

An encapsulation is used to contain variable-length data that an intermediate receiver may not be able to decode, but
that the receiver can forward to another recipient for eventual decoding. An encapsulation is encoded as if it were the
following structure:

```slice
struct Encapsulation
{
    int size;
    byte major;
    byte minor;
    // [... size - 6 bytes ...]
}
```

The `size` field specifies the size of the encapsulation in bytes (including the `size`, `major`, and `minor` fields).
The `major` and `minor` fields specify the encoding version of the data contained in the encapsulation. The version
information is followed by `size-6` bytes of encoded data.

All the data in an encapsulation is context-free, that is, nothing inside an encapsulation can refer to anything outside
the encapsulation. This property allows encapsulations to be forwarded among address spaces as a blob of data.

Encapsulations can be nested, that is, contain other encapsulations.

An encapsulation can be empty, in which case the value of `size` is 6.

## Encoding for Basic Types

The basic types are encoded as shown in the table. Integer types (`short`, `int`, `long`) are represented as two's
complement numbers, and floating point types (`float`, `double`) use the IEEE standard formats. All numeric types use a
little-endian byte order.

| **Type** | **Encoding**                                                        |
| -------- | ------------------------------------------------------------------- |
| `bool`   | A single byte with value `1` for `true`, `0` for `false`            |
| `byte`   | An uninterpreted byte                                               |
| `short`  | Two bytes (LSB, MSB)                                                |
| `int`    | Four bytes (LSB .. MSB)                                             |
| `long`   | Eight bytes (LSB .. MSB)                                            |
| `float`  | Four bytes (23-bit fractional mantissa, 8-bit exponent, sign bit)   |
| `double` | Eight bytes (52-bit fractional mantissa, 11-bit exponent, sign bit) |

_Encoding for basic types._

## Encoding for Strings

A string is encoded as a [size](#encoding-for-sizes) holding the number of bytes in its
[UTF-8](https://en.wikipedia.org/wiki/UTF-8) encoding, followed by those bytes. An empty string is encoded as a size of
zero.

## Encoding for Sequences

Sequences are encoded as a [size](#encoding-for-sizes) representing the number of elements in the sequence, followed by
the elements encoded as specified for their type.

## Encoding for Dictionaries

Dictionaries are encoded as a [size](#encoding-for-sizes) representing the number of key-value pairs in the dictionary,
followed by the pairs. Each key-value pair is encoded as if it were a `struct` containing the key and value as fields,
in that order.

## Encoding for Enumerators

The encoding format of enumerators changed in version 1.1.

### Encoding Version 1.0 {% id="enumerator-encoding-version-1.0" %}

The number of bytes required to encode an enumerator in version 1.0 is determined by the largest value in the
enumeration. In enumerations with no [custom enumerator values](../../slice/user-defined-types/enumerations), the
largest value is the number of enumerators less one; the value encoded for an enumerator is its ordinal value in the
definition, with the first enumerator having the value zero. For example, the largest value in the following enumeration
is 2:

```slice
// Encoded values: Apple = 0, Pear = 1, Orange = 2
enum Fruit { Apple, Pear, Orange }
```

When an enumeration includes custom values, the encoding uses the enumerator's assigned value, which is not necessarily
the same as its ordinal value. Consider this example:

```slice
// Encoded values: Apple = 1, Pear = 3, Orange = 4
enum Fruit { Apple = 1, Pear = 3, Orange }
```

The largest value in this case is 4.

An enumerator is encoded as follows:

- If the largest value is in the range 0..126, the enumerator's value is marshaled as a `byte`.
- If the largest value is in the range 127..32766, the enumerator's value is marshaled as a `short`.
- If the largest value is greater than 32766, the enumerator's value is marshaled as an `int`.

{% callout type="danger" %}

Changing the definition of an enumeration can break compatibility with existing applications. For example, if
enumerators are added, removed, or changed such that the largest value crosses one of the thresholds shown above, the
encoded form of the enumerators will change and cause marshaling errors unless you rebuild all applications that use
this definition.

{% /callout %}

### Encoding Version 1.1 {% id="enumerator-encoding-version-1.1" %}

An enumerator is encoded as a [size](#encoding-for-sizes), meaning the encoding of an enumerator requires one byte if
its value is less than 255, or five bytes if its value is 255 or greater. The encoding uses the Slice value of the
enumerator, which is not necessarily the same as its ordinal value. Repeating the previous example:

```slice
// Encoded values: Apple = 1, Pear = 3, Orange = 4
enum Fruit { Apple = 1, Pear = 3, Orange }
```

Although enumerator `Pear` may have ordinal value 1 in some language mappings (notably, Java), the encoding uses its
Slice value of 3.

## Encoding for Structures

The fields of a structure are encoded in the order they appear in the `struct` declaration, as specified for their
types.

## See Also

- [Protocol Messages](../../protocol/protocol-messages)
- [Data Encoding for Exceptions](../data-encoding-for-exceptions)
- [Data Encoding for Classes](../data-encoding-for-classes)
