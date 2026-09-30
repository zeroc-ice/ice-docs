{% language-section name="lang-1" %}

### Default Sequence Mapping

A Slice sequence maps to a native Python type:

- By default, sequences map to a **list**.
- `sequence<byte>` maps to a **bytes** object, reducing memory usage and improving throughput.

Because native types are used, the Python mapping does not generate a separate named type for a Slice sequence. You can
take advantage of all the functionality provided by Python’s built-in types.

For example:

```slice
sequence<Fruit> FruitPlatter;
```

Usage in Python:

```py
platter = [ Fruit.Apple, Fruit.Pear ]
assert(len(platter) == 2)
platter.append(Fruit.Orange)
```

The Ice runtime validates the elements of a list (or tuple) to ensure they match the declared type. A `ValueError` is
raised if an incompatible type is encountered.

### Allowable Sequence Values

When you **send a sequence value** (for example, when calling a proxy method, or when returning a value or setting an
output parameter in a servant method), you have flexibility:

- For all sequences, you can use any type that conforms to the Python `collections.abc.Sequence` abstract base class,
  provided its elements match the Python-mapped type of the Slice element.
- For `sequence<byte>`, in addition to a bytes object, you may also use any type that conforms to `Sequence[int]`.

{% callout type="info" %}

Using a bytes object for a byte sequence bypasses the validation step and avoids an extra copy, resulting in much
greater throughput than a tuple or list. For larger byte sequences, the use of a bytes object is strongly recommended.

{% /callout %}

Examples:

```py
# Slice: sequence<int>
ok1 = [1, 2, 3]          # list[int]
ok2 = (4, 5, 6)          # tuple[int]
bad = ["a", "b", "c"]    # raises ValueError (wrong element type)

# Slice: sequence<byte>
ok3 = bytes([1, 2, 3])   # efficient, recommended
ok4 = [4, 5, 6]          # list[int] also accepted
ok5 = (7, 8, 9)          # tuple[int] also accepted
```

Furthermore, the Ice runtime accepts any object that implements Python’s **buffer protocol** as a valid value for
sequences of all primitive types (except strings).

For example, you can use the array module to create a buffer that is transferred more efficiently than a tuple or list:

```py
import array
...
seq1 = array.array("i", [1, 2, 3, 4, 5])
seq2 = [1, 2, 3, 4, 5]
```

Both values have the same on-the-wire representation, but buffers incur much less marshaling overhead than lists or
tuples.

### Customizing the Sequence Mapping

When you **receive** a sequence (e.g., as a field value, a dispatch method parameter, or an invocation return/out
parameter), the container is created by the Ice runtime.

By default:

- Most sequences are received as **lists**.
- `sequence<byte>` is received as a **bytes** object.

You can change the container type used for received sequences by adding metadata to your Slice definitions.

#### Supported Metadata Directives

| **Metadata**                                                | **Description**                                                                                                               |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `python:list`                                               | Map to a Python list.                                                                                                         |
| `python:tuple`                                              | Map to a Python tuple.                                                                                                        |
| `python:array.array`                                        | Map to a Python `array.array` (valid for integral types, excluding strings).                                                  |
| `python:numpy.ndarray`                                      | Map to a `numpy.ndarray` (valid for integral types, excluding strings).                                                       |
| `python:memoryview:<factory function>:<optional type hint>` | Map to a custom Python type created from a memoryview using a factory function (valid for integral types, excluding strings). |

Metadata can be specified when defining a sequence, or at the point of use (parameter, return value, or field).

- At the definition site, it applies to all uses unless overridden.
- At the point of use, it overrides the default or definition-level mapping.

```slice
sequence<int> IntList;                    // Defaults to list
["python:tuple"] sequence<int> IntTuple;  // Defaults to tuple

sequence<byte> ByteString;                // Defaults to bytes
["python:list"] sequence<byte> ByteList;  // Defaults to list

["python:array.array"] sequence<int> IntArray;    // Defaults to array.array
["python:numpy.ndarray"] sequence<long> LongArray; // Defaults to numpy.ndarray

struct S
{
    IntList i1;                // list
    IntTuple i2;               // tuple
    ["python:tuple"] IntList i3; // tuple
    ["python:list"] IntTuple i4; // list

    ByteString b1;             // bytes
    ByteList b2;               // list
    ["python:list"] ByteString b3; // list
    ["python:tuple"] ByteString b4; // tuple
}

interface I
{
    IntList op1(ByteString s1, out ByteList s2);

    ["python:tuple"]
    IntList op2(
        ["python:list"] ByteString s1,
        ["python:tuple"] out ByteList s2);
}
```

- The fields of S show how metadata can change the container type per field.
- The operation op2 shows how metadata applies differently for input parameters (server) and for return/out parameters
  (client).

While you can override the containers type at the point of use is typically more convenient to define different sequence
types each with the desired metadata, and use them instead of specifying the metadata at the point of use.

#### Using python:memoryview

The python:memoryview directive provides maximum flexibility: you can supply a factory function that maps unmarshaled
data to a custom sequence type.

For example, suppose your application uses NumPy arrays of `numpy.complex128`. You can define a sequence with:

```slice
["python:memoryview:Custom.myNumPyComplex128Seq:numpy.ndarray"]
sequence<byte> Complex128Seq;

Complex128Seq opComplex();
```

Factory function implementation:

```py
def myNumPyComplex128Seq(buffer: memoryview | None, type: int) -> numpy.ndarray:
    if buffer is None:
        return numpy.empty(0, numpy.complex128)
    else:
        return numpy.frombuffer(buffer.tobytes(), numpy.complex128)
```

- buffer: a memoryview containing the unmarshaled data.
- type: the element type (here `Ice.BuiltinByte` because the sequence element is `byte`).

#### Slice Element Type ↔ Python Constant

| **Slice Element Type** | **Python Constant** |
| ---------------------- | ------------------- |
| bool                   | Ice.BuiltinBool     |
| byte                   | Ice.BuiltinByte     |
| short                  | Ice.BuiltinShort    |
| int                    | Ice.BuiltinInt      |
| long                   | Ice.BuiltinLong     |
| float                  | Ice.BuiltinFloat    |
| double                 | Ice.BuiltinDouble   |

{% /language-section %}
