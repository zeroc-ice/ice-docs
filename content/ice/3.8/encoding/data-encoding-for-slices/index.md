---
title: Data Encoding for Slices
---

Ice marshals an [exception](../data-encoding-for-exceptions) or a [class](../data-encoding-for-classes) instance as a
sequence of slices, one for each level of its inheritance hierarchy, starting with the most-derived type. Each slice
holds the fields declared by its type. A receiver that knows only a base type of the instance can
[slice off](../../slice/user-defined-types/classes/slicing-values-and-exceptions) the derived parts it does not
understand by skipping their slices, provided each slice carries its byte count.

## Encoding Version 1.0

In version 1.0, a slice is a byte count encoded as a fixed-length four-byte integer, followed by the data for the slice.
(The byte count includes the four bytes occupied by the count itself, so an empty slice has a byte count of four and no
data.) The receiver of a value can skip over a slice by reading the byte count _b_, and then discarding the next _b-4_
bytes in the input stream.

## Encoding Version 1.1

In version 1.1, a slice starts with a byte of bit flags that determine its format and content.

### Type ID

Every slice of an exception includes its type ID, encoded as a string.

The initial slice of a class, representing the instance's most-derived type, always includes a type ID. When the class
has a compact type ID, the slice encodes this compact ID as a size. Otherwise, the slice encodes the type ID as a string
the first time this type ID appears in the encapsulation; when the type ID string was already encoded in this
encapsulation, the slice encodes instead an index to this earlier type ID, as a size. The sender's
[format](../../slice/user-defined-types/classes/slicing-values-and-exceptions) determines whether subsequent slices of a
class include a type ID: to facilitate slicing an instance to a less-derived type, the sliced format includes a type ID
in every slice, whereas the compact format excludes type IDs in subsequent slices to conserve space while sacrificing
the slicing feature.

### Optional Fields

This flag is true if the slice includes any [optional fields](../../slice/fields), which are encoded after all required
fields. If a slice encodes its size, the size includes the optional fields.

### Object Indirection Table

This flag can only be true when using the
[sliced format](../../slice/user-defined-types/classes/slicing-values-and-exceptions). In this case, fields that refer
to class instances are encoded as indices into an [indirection table](../data-encoding-for-classes) that immediately
follows the slice. The slice's size does _not_ include the indirection table. This flag should only be set to true when
there is at least one non-nil object reference in the slice, that is, when the indirection table is not empty.

### Slice Size

If this flag is true, a byte count encoded as a fixed-length four-byte integer immediately follows the type ID. (The
byte count includes the four bytes occupied by the count itself, so an empty slice has a byte count of four and no
data.) The byte count indicates the number of bytes occupied by the encoding for the required and optional fields, but
does not include the size of an object indirection table, if present.

A receiver can skip over a slice by reading the byte count _b_, and then discarding the next _b-4_ bytes in the input
stream. If an object indirection table is present, the receiver must then decode the table.

If this flag is false, it implies that the sender used the
[compact format](../../slice/user-defined-types/classes/slicing-values-and-exceptions) and therefore skipping slices is
not possible. The receiver must know the most-derived type in this situation otherwise decoding will fail.

### Last Slice

This flag indicates whether the current slice is the last slice of the instance.

### Slice Flags

The table below shows how to interpret the bit flags in the leading byte of a slice:

| **Bit number** | **Description**                                             |
| -------------- | ----------------------------------------------------------- |
| 0-1            | Type ID of a class slice:                                   |
|                | 0 = no type ID is encoded for the slice                     |
|                | 1 = type ID is encoded as a string                          |
|                | 2 = type ID is an index encoded as a size                   |
|                | 3 = type ID is a compact ID encoded as a size               |
| 2              | Whether or not the slice contains optional fields           |
| 3              | Whether or not the slice contains an indirection table      |
| 4              | Whether or not the slice size follows the type ID           |
| 5              | If 0, more slices will follow, if 1, this is the last slice |
| 6              | Reserved for future use                                     |
| 7              | Reserved for future use                                     |

_Bit flags for a slice._

An exception slice leaves bits 0-1 at 0.

## See Also

- [Basic Data Encoding](../basic-data-encoding)
- [Data Encoding for Exceptions](../data-encoding-for-exceptions)
- [Data Encoding for Classes](../data-encoding-for-classes)
- [Slicing Values and Exceptions](../../slice/user-defined-types/classes/slicing-values-and-exceptions)
