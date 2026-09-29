{% language-section name="lang-1" %}

## Default Mapping

A Slice sequence maps to a Java array. This means that the Slice-to-Java compiler does not generate a separate named
type for a Slice sequence.

For example:

```slice
sequence<Fruit> FruitPlatter;
```

This definition simply corresponds to the Java type `Fruit[]`. Naturally, because Slice sequences are mapped to Java
arrays, you can take advantage of all the array functionality provided by Java, such as initialization, assignment,
cloning, and the `length` member. For example:

```java
Fruit[] platter = { Fruit.Apple, Fruit.Pear };
assert(platter.length == 2);
```

## Customizing the Sequence Mapping with `java:type`

The `java:type:instance-type[:formal-type]` metadata directive allows you to map a given Slice type, field or parameter
to the Java type of your choice.

The formal type is optional; the compiler uses a default value if one is not defined. The instance type must satisfy an
is-A relationship with the formal type: either the same class is specified for both types, or the instance type must be
derived from the formal type.

The Slice-to-Java compiler generates code that uses the formal type for all occurrences of the modified Slice definition
except when the generated code must instantiate the type, in which case the compiler uses the instance type instead. The
compiler performs no validation on your custom types. Misspellings and other errors will not be apparent until you
compile the generated code.

For example, you can override the default mapping of a Slice sequence type:

```slice
module Food
{
    enum Fruit { Apple, Pear, Orange };

    ["java:type:java.util.LinkedList<Fruit>"]
    sequence<Fruit> FruitPlatter;
}
```

With this metadata directive, the Slice sequence now maps to a Java `LinkedList` instead of the default array.

It is your responsibility to use a type parameter for the Java class (`Fruit` in the example above) that is the correct
mapping for the sequence's element type.

The compiler requires the formal type to implement `java.util.List<E>`, where `E` is the Java mapping of the element
type. If you do not specify a formal type, the compiler uses `java.util.List<E>` by default.

Note that extra care must be taken when defining custom types that contain nested generic types, such as a custom
sequence whose element type is also a custom sequence. The Java compiler strictly enforces type safety, therefore any
compatibility issues in the custom type metadata will be apparent when the generated code is compiled.

## Using the `java:type` Metadata Directive

You can define custom type metadata in a variety of situations. The simplest scenario is specifying the metadata at the
point of definition:

```slice
["java:type:java.util.LinkedList<String>"]
sequence<string> StringList;
```

Defined in this manner, the Slice-to-Java compiler uses `java.util.List<String>` (the default formal type) for all
occurrences of `StringList`, and `java.util.LinkedList<String>` when it needs to instantiate `StringList`.

You may also specify a custom type more selectively by defining metadata for a field, parameter or return value. For
instance, the mapping for the original Slice definition might be sufficient in most situations, but a different mapping
is more convenient in particular cases. The example below demonstrates how to override the sequence mapping for the
field of a structure as well as for several operations:

```slice
sequence<string> StringSeq;

struct S
{
    ["java:type:java.util.LinkedList<String>"] StringSeq seq;
}

interface I
{
    ["java:type:java.util.ArrayList<String>"] StringSeq
    modifiedReturnValue();

    void modifiedInParam(["java:type:java.util.ArrayList<String>"] StringSeq seq);

    void modifiedOutParam(out ["java:type:java.util.ArrayList<String>"] StringSeq seq);
}
```

As you might expect, modifying the mapping for an operation's parameters or return value may require the application to
manually convert values from the original mapping to the modified mapping. For example, suppose we want to invoke the
`modifiedInParam` operation. The signature of its proxy operation is shown below:

```java
void modifiedInParam(java.util.List<String> seq)
```

The metadata changes the mapping of the `seq` parameter to `java.util.List`, which is the default formal type. If a
caller has a `StringSeq` value in the original mapping, it must convert the array as shown in the following example:

```java
String[] seq = new String[2];
seq[0] = "hi";
seq[1] = "there";
IPrx proxy = ...;
proxy.modifiedInParam(java.util.Arrays.asList(seq));
```

Although we specified the instance type `java.util.ArrayList<String>` for the parameter, we are still able to pass the
result of `asList` because its return type (`java.util.List<String>`) is compatible with the parameter's formal type
declared by the proxy method. In the case of an operation parameter, the instance type is only relevant to a servant
implementation, which may need to make assumptions about the actual type of the parameter.

## Buffer Types

You can annotate sequences of certain primitive types with the `java:buffer` metadata directive to change the mapping to
use subclasses of `java.nio.Buffer`. This mapping provides several benefits:

- You can pass a buffer to a Slice API instead of creating and filling a temporary array
- If you need to pass a portion of an existing array, you can wrap it with a buffer and avoid an extra copy
- Receiving buffers during a Slice operation also avoids copying by directly referencing the data in Ice's unmarshaling
  buffer

{% callout type="warning" %}

To use buffers safely, applications must disable caching by setting [Ice.CacheMessageBuffers](../ice-properties) to
zero.

{% /callout %}

The following table lists each supported Slice primitive type with its corresponding mapped class:

| **Primitive** | **Mapping**             |
| ------------- | ----------------------- |
| `byte`        | `java.nio.ByteBuffer`   |
| `short`       | `java.nio.ShortBuffer`  |
| `int`         | `java.nio.IntBuffer`    |
| `long`        | `java.nio.LongBuffer`   |
| `float`       | `java.nio.FloatBuffer`  |
| double        | `java.nio.DoubleBuffer` |

The `java:buffer` directive can be applied to the initial definition of a sequence, in which case the mapping uses the
buffer type for all occurrences of that sequence type:

```slice
["java:buffer"] sequence<int> Values;

struct Observation
{
    int x;
    int y;
    Values measurements;
}
```

We can construct an `Observation` as follows:

```java
Observation obs = new Observation();
obs.x = 5;
obs.y = 9;
obs.measurements = java.nio.IntBuffer.allocate(10);
for(int i = 0; i < obs.measurements.capacity(); ++i)
{
    obs.measurements.put(i, ...);
}
```

The `java:buffer` directive can also be applied in more limited situations to override a sequence's normal mapping:

```slice
sequence<byte> ByteSeq; // Maps to byte[]

struct Page
{
    int offset;
    ["java:buffer"] ByteSeq data; // Maps to java.nio.ByteBuffer
}

interface Decoder
{
    ["java:buffer"] ByteSeq decode(ByteSeq data);
}
```

In this example, `ByteSeq` maps by default to a `byte` array, but we've overridden the mapping to use a buffer when this
type is used as a field in `Page` and as the return value of the `decode` operation; the input parameter to `decode`
uses the default array mapping.

## Filling a Sequence of Bytes with a Serializable Object

In Java terminology, a _serializable object_ typically refers to an object that implements the `java.io.Serializable`
interface and therefore supports serialization to and from a byte stream. All Java classes generated from Slice
definitions implement the `java.io.Serializable` interface.

In addition to serializing Slice types, applications may also need to incorporate foreign types into their Slice
definitions. Ice allows you to pass Java serializable objects directly as operation parameters or as fields of another
data type. For example:

```
["java:serializable:SomePackage.JavaClass"]
sequence<byte> JavaObj;

struct MyStruct
{
    int i;
    JavaObj o;
}

interface Example
{
    void op(JavaObj inObj, MyStruct s, out JavaObj outObj);
}
```

The generated code for `MyStruct` contains a member `i` of type `int` and a member `o` of type `SomePackage.JavaClass`:

```
public final class MyStruct implements java.lang.Cloneable
{
    public int i;
    public SomePackage.JavaClass o;
    // ...
}
```

Similarly, the signature for `op` has parameters of type `JavaClass` and `MyStruct` for the in-parameters and returns
`JavaClass`:

```
SomePackage.JavaClass op(SomePackage.JavaClass inObj, MyStruct s);
```

Of course, your client and server code must have an implementation of `JavaClass` that derives from
`java.io.Serializable`:

```
package SomePackage;
public class JavaClass implements java.io.Serializable
{
    // ...
}
```

You can implement this class in any way you see fit — the Ice runtime does not place any other requirements on the
implementation.

{% /language-section %}
