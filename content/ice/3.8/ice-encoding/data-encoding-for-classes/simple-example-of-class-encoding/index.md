---
title: Simple Example of Class Encoding
---

# Sample Class Definitions

We have separately discussed the primary components of the class encoding: [slices](../basic-data-encoding),
[references](../data-encoding-for-classes), and [type IDs](../data-encoding-for-class-type-ids). To make the preceding
discussions more concrete, consider the following class definitions:

```slice
class Base
{
    int baseInt;
    string baseString;
}

class Derived extends Base
{
    bool derivedBool;
    string derivedString;
    double derivedDouble;
}
```

Suppose the sender marshals two instances of `Derived` (for example, as two in-parameters in the same request) with
these field values:

**First instance:**

| **Field**       | **Type** | **Value**  | **Marshaled size (in bytes)** |
| --------------- | -------- | ---------- | ----------------------------- |
| `baseInt`       | `int`    | `99`       | 4                             |
| `baseString`    | `string` | `"Hello"`  | 6                             |
| `derivedBool`   | `bool`   | `true`     | 1                             |
| `derivedString` | `string` | `"World!"` | 7                             |
| `derivedDouble` | `double` | `3.14`     | 8                             |

**Second instance:**

| **Field**       | **Type** | **Value** | **Marshaled size (in bytes)** |
| --------------- | -------- | --------- | ----------------------------- |
| `baseInt`       | `int`    | `115`     | 4                             |
| `baseString`    | `string` | `"Cave"`  | 5                             |
| `derivedBool`   | `bool`   | `false`   | 1                             |
| `derivedString` | `string` | `"Canem"` | 6                             |
| `derivedDouble` | `double` | `6.32`    | 8                             |

We describe how to marshal these instances using versions 1.0 and 1.1 of the encoding in separate sections below.

# Class Encoding version 1.0

The sender arbitrarily assigns a non-zero [identity](../data-encoding-for-classes) to each instance. Typically, the
sender will simply consecutively number the instances starting at `1`. For this example, assume that the two instances
have the identities `1` and `2`. The marshaled representation for the two instances (assuming that they are marshaled
immediately following each other) is shown below:

| **Marshaled value**                    | **Size in bytes** | **Type** | **Byte offset** |
| -------------------------------------- | ----------------- | -------- | --------------- |
| `1` _(identity)_                       | 4                 | `int`    | 0               |
| `0` _(marker for class type_ _ID)_     | 1                 | `bool`   | 4               |
| `"::Derived"` _(class type_ _ID)_      | 10                | `string` | 5               |
| `20` _(byte count for slice)_          | 4                 | `int`    | 15              |
| `1` _(_`derivedBool`)                  | 1                 | `bool`   | 19              |
| `"World!"` _(_`derivedString`)         | 7                 | `string` | 20              |
| `3.14` _(_`derivedDouble`)             | 8                 | `double` | 27              |
| `0` _(marker for class type_ _ID)_     | 1                 | `bool`   | 35              |
| `"::Base"` _(type ID)_                 | 7                 | `string` | 36              |
| `14` _(byte count for slice)_          | 4                 | `int`    | 43              |
| `99` _(_`baseInt`)                     | 4                 | `int`    | 47              |
| `"Hello"` _(_`baseString`)             | 6                 | `string` | 51              |
| `0` _(marker for class type_ _ID)_     | 1                 | `bool`   | 57              |
| `"::Ice::Object"` _(class_ _type ID)_  | 14                | `string` | 58              |
| `5` _(byte count for slice)_           | 4                 | `int`    | 72              |
| `0` _(number of dictionary_ _entries)_ | 1                 | `size`   | 76              |
| `2` _(identity)_                       | 4                 | `int`    | 77              |
| `1` _(marker for class type_ _ID)_     | 1                 | `bool`   | 81              |
| `1` _(class type ID)_                  | 1                 | `size`   | 82              |
| `19` _(byte count for slice)_          | 4                 | `int`    | 83              |
| `0` _(_`derivedBool`)                  | 1                 | `bool`   | 87              |
| `"Canem"` _(_`derivedString`)          | 6                 | `string` | 88              |
| `6.32` _(_`derivedDouble`)             | 8                 | `double` | 94              |
| `1` _(marker for class type_ _ID)_     | 1                 | `bool`   | 102             |
| `2` _(class type ID)_                  | 1                 | `size`   | 103             |
| `13` _(byte count for slice)_          | 4                 | `int`    | 104             |
| `115` _(_`baseInt`)                    | 4                 | `int`    | 108             |
| `"Cave"` _(_`baseString`)              | 5                 | `string` | 112             |
| `1` _(marker for class type_ _ID)_     | 1                 | `bool`   | 117             |
| `3` _(class type ID)_                  | 1                 | `size`   | 118             |
| `5` _(byte count for slice)_           | 4                 | `int`    | 119             |
| `0` _(number of dictionary entries)_   | 1                 | `size`   | 123             |

Note that, because classes (like [exceptions](../data-encoding-for-exceptions)) are sent as a sequence of
[slices](../basic-data-encoding), the receiver of a class can slice off any derived parts of a class it does not
understand. Also note that (as shown in the above table) each class instance contains three slices. The third slice is
for the type `::Ice::Object`, which is the base type of all classes. The class [type ID](../type-ids) `::Ice::Object`
has the number `3` in this example because it is the third distinct type ID that is marshaled by the sender. (See
entries at byte offsets 58 and 118 in the above table.) All class instances have this final slice of type
`::Ice::Object`.

Note that if a class has no fields, a type ID and slice for that class is still marshaled. The byte count of the slice
will be 4 in this case, indicating that the slice contains no data.

# Class Encoding version 1.1

A leading [size](../basic-data-encoding) value of `1` marks the beginning of an instance, followed by one or more
[slices](../basic-data-encoding).

### Class Encoding in the Sliced Format

The marshaled representation for the two instances (assuming that they are marshaled immediately following each other)
in the [sliced format](../slicing-values-and-exceptions) is shown below:

| **Marshaled value**                                             | **Size in bytes** | **Type** | **Byte offset** |
| --------------------------------------------------------------- | ----------------- | -------- | --------------- |
| `1` _(instance marker)_                                         | 1                 | `size`   | 0               |
| 17 _(slice flags: string type ID, size is present)_             | 1                 | `byte`   | 1               |
| `"::Derived"` _(type_ _ID - assigned index_`1`_)_               | 10                | `string` | 2               |
| `20` _(byte count for slice)_                                   | 4                 | `int`    | 12              |
| `1` _(_`derivedBool`)                                           | 1                 | `bool`   | 16              |
| `"World!"` _(_`derivedString`)                                  | 7                 | `string` | 17              |
| `3.14` _(_`derivedDouble`)                                      | 8                 | `double` | 24              |
| 49 _(slice flags: string type ID, size is present, last slice)_ | 1                 | `byte`   | 32              |
| `"::Base"` _(type ID - assigned index_`2`_)_                    | 7                 | `string` | 33              |
| `14` _(byte count for slice)_                                   | 4                 | `int`    | 40              |
| `99` _(_`baseInt`)                                              | 4                 | `int`    | 44              |
| `"Hello"` _(_`baseString`)                                      | 6                 | `string` | 48              |
| `1` _(instance marker)_                                         | 1                 | `size`   | 54              |
| 18 _(slice flags: index type ID, size is present)_              | 1                 | `byte`   | 55              |
| `1` _(type_ _ID index for_`Derived`_)_                          | 1                 | `size`   | 56              |
| `19` _(byte count for slice)_                                   | 4                 | `int`    | 57              |
| `0` _(_`derivedBool`)                                           | 1                 | `bool`   | 61              |
| `"Canem"` _(_`derivedString`)                                   | 6                 | `string` | 62              |
| `6.32` _(_`derivedDouble`)                                      | 8                 | `double` | 68              |
| 50 _(slice flags: index type ID, size is present, last slice)_  | 1                 | `byte`   | 76              |
| `2` _(type_ _ID index for_`Base`_)_                             | 1                 | `size`   | 77              |
| `13` _(byte count for slice)_                                   | 4                 | `int`    | 78              |
| `115` _(_`baseInt`)                                             | 4                 | `int`    | 82              |
| `"Cave"` _(_`baseString`)                                       | 5                 | `string` | 86              |

The sliced format allows the receiver of a class to slice off any derived parts of a class it does not understand, as in
version 1.0 of the encoding. Although the sliced format provides equivalent functionality to that of version 1.0, it is
significantly more efficient, requiring only 91 bytes to encode our example compared to the 124 bytes required by
version 1.0. We could reduce the encoded size even further, while still retaining the ability to slice off unknown
types, by using [compact type IDs](../data-encoding-for-class-type-ids).

Note that if a class has no fields, a type ID and slice for that class is still marshaled. The byte count of the slice
will be 4 in this case, indicating that the slice contains no data.

### Class Encoding in the Compact Format

The marshaled representation for the two instances (assuming that they are marshaled immediately following each other)
in the [compact format](../slicing-values-and-exceptions) is shown below:

| **Marshaled value**                               | **Size in bytes** | **Type** | **Byte offset** |
| ------------------------------------------------- | ----------------- | -------- | --------------- |
| `1` _(instance marker)_                           | 1                 | `size`   | 0               |
| `1` _(slice flags: string type ID)_               | 1                 | `byte`   | 1               |
| `"::Derived"` _(type_ _ID - assigned index_`1`_)_ | 10                | `string` | 2               |
| `1` _(_`derivedBool`)                             | 1                 | `bool`   | 12              |
| `"World!"` _(_`derivedString`)                    | 7                 | `string` | 13              |
| `3.14` _(_`derivedDouble`)                        | 8                 | `double` | 20              |
| `32` _(slice flags: last slice)_                  | 1                 | `byte`   | 28              |
| `99` _(_`baseInt`)                                | 4                 | `int`    | 29              |
| `"Hello"` _(_`baseString`)                        | 6                 | `string` | 33              |
| `1` _(instance marker)_                           | 1                 | `size`   | 39              |
| `2` _(slice flags: index type ID)_                | 1                 | `byte`   | 40              |
| `1` _(type_ _ID index for_`Derived`_)_            | 1                 | `size`   | 41              |
| `0` _(_`derivedBool`)                             | 1                 | `bool`   | 42              |
| `"Canem"` _(_`derivedString`)                     | 6                 | `string` | 43              |
| `6.32` _(_`derivedDouble`)                        | 8                 | `double` | 49              |
| `32` _(slice flags: last slice)_                  | 1                 | `byte`   | 57              |
| `115` _(_`baseInt`)                               | 4                 | `int`    | 58              |
| `"Cave"` _(_`baseString`)                         | 5                 | `string` | 62              |

In an effort to conserve bandwidth, the compact format omits certain details that would allow a receiver to slice off
derived parts of a class, such as the slice size and the type IDs for base classes. The result is an encoding that
requires only 67 bytes for the two sample instances.

Note that if a class has no fields, a type ID and slice for that class is still marshaled. The byte count of the slice
will be 4 in this case, indicating that the slice contains no data.

### Class Encoding in the Compact Format with Compact Type IDs

[Compact type IDs](../data-encoding-for-class-type-ids) can be used regardless of the sender's chosen
[format](../slicing-values-and-exceptions). For the sake of example, we will use compact type IDs together with the
compact format to produce the smallest encoding possible. The Slice definitions below reflect the addition of the
compact type IDs:

```slice
class Base(10)
{
    int baseInt;
    string baseString;
}

class Derived(11) extends Base
{
    bool derivedBool;
    string derivedString;
    double derivedDouble;
}
```

We assign the compact type ID `10` to `Base` and `11` to `Derived`. Note however that assigning a compact type ID to
`Base` does not affect the size of the encoded data in our example because the compact format omits type IDs altogether
for base types.

The marshaled representation for the two instances (assuming that they are marshaled immediately following each other)
in the compact format is shown below:

| **Marshaled value**                       | **Size in bytes** | **Type** | **Byte offset** |
| ----------------------------------------- | ----------------- | -------- | --------------- |
| `1` _(instance marker)_                   | 1                 | `size`   | 0               |
| `3` _(slice flags: compact type ID)_      | 1                 | `byte`   | 1               |
| `11` _(compact type ID for_`Derived`_)_   | 1                 | `size`   | 2               |
| `1` _(_`derivedBool`)                     | 1                 | `bool`   | 3               |
| `"World!"` _(_`derivedString`)            | 7                 | `string` | 4               |
| `3.14` _(_`derivedDouble`)                | 8                 | `double` | 11              |
| `32` _(slice flags: last slice)_          | 1                 | `byte`   | 19              |
| `99` _(_`baseInt`)                        | 4                 | `int`    | 20              |
| `"Hello"` _(_`baseString`)                | 6                 | `string` | 24              |
| `1` _(instance marker)_                   | 1                 | `size`   | 30              |
| `3` _(slice flags: compact type ID)_      | 1                 | `byte`   | 31              |
| `11` _(compact type_ _ID for_`Derived`_)_ | 1                 | `size`   | 32              |
| `0` _(_`derivedBool`)                     | 1                 | `bool`   | 33              |
| `"Canem"` _(_`derivedString`)             | 6                 | `string` | 34              |
| `6.32` _(_`derivedDouble`)                | 8                 | `double` | 40              |
| `32` _(slice flags: last slice)_          | 1                 | `byte`   | 48              |
| `115` _(_`baseInt`)                       | 4                 | `int`    | 49              |
| `"Cave"` _(_`baseString`)                 | 5                 | `string` | 53              |

Substituting a compact type ID for its string equivalent reduces the encoded size for the two instances by another nine
bytes to 58, less than half the size of version 1.0.

##### See Also

- [Data Encoding for Classes](../data-encoding-for-classes)
- [Data Encoding for Exceptions](../data-encoding-for-exceptions)
- [Basic Data Encoding](../basic-data-encoding)
- [Type IDs](../type-ids)
