{% language-section name="lang-1" %}

### Default Mapping

Here is the definition of our FruitPlatter sequence once more:

```slice
sequence<Fruit> FruitPlatter;
```

The Slice compiler generates the following definition for the `FruitPlatter` sequence:

```cpp
using FruitPlatter = std::vector<Fruit>;
```

As you can see, the sequence simply maps to a standard `std::vector`, so you can use the sequence like any other vector.
For example:

```cpp
// Make a small platter with one Apple and one Orange
FruitPlatter p;
p.push_back(Fruit::Apple);
p.push_back(Fruit::Orange);
```

### Customizing the Sequence Mapping with `cpp:type`

The `cpp:type:c++-type` metadata directive allows you to map a given Slice type, field or parameter to the C++ type of
your choice.

For example, you can override the default mapping of a Slice sequence type:

```slice
[["cpp:include:list"]]

module Food
{
    enum Fruit { Apple, Pear, Orange };

    ["cpp:type:std::list<Food::Fruit>"]
    sequence<Fruit> FruitPlatter;
}
```

With this metadata directive, the Slice sequence now maps to a C++ `std::list` instead of the default `std::vector`:

```cpp
#include <list>

namespace Food
{
    using FruitPlatter = std::list<Food::Fruit>;

    // ...
}
```

The Slice to C++ compiler takes the string following the `cpp:type:` prefix as the name of the mapped C++ type. For
example, we could use `["cpp:type:::std::list<::Food::Fruit>"]`. In that case, the compiler would use a fully-qualified
name to define the type:

```cpp
using FruitPlatter = ::std::list<::Food::Fruit>;
```

Note that the code generator inserts whatever string you specify following the `cpp:type:` prefix literally into the
generated code. We recommend you use fully qualified names to avoid C++ compilation failures due to unknown symbols.

Also note that, to avoid compilation errors in the generated code, you must instruct the compiler to generate an
appropriate include directive with the `cpp:include` file metadata directive. This causes the compiler to add the line

```cpp
#include <list>
```

to the generated header file.

In addition to modifying the type of a sequence itself, you can also modify the mapping for particular
[return values or parameters](../operations). For example:

```slice
[["cpp:include:list"]]
[["cpp:include:deque"]]

module Food
{
    enum Fruit { Apple, Pear, Orange }

    sequence<Fruit> FruitPlatter;

    interface Market
    {
        ["cpp:type:std::list<::Food::Fruit>"]
        FruitPlatter barter(["cpp:type:std::deque<::Food::Fruit>"] FruitPlatter offer);
    }
}
```

With this definition, the default mapping of `FruitPlatter` to a C++ `vector` still applies but the return value of
`barter` is mapped as a `list`, and the `offer` parameter is mapped as a `deque`.

Instead of `std::list` or `std::deque`, you can specify a type of your own as the sequence type, for example:

```slice
[["cpp:include:FruitBowl.h"]]

module Food
{
    enum Fruit { Apple, Pear, Orange }

    ["cpp:type:FruitBowl"]
    sequence<Fruit> FruitPlatter;
}
```

With these metadata directives, the compiler will use a C++ type `FruitBowl` as the sequence type, and add an `include`
directive for the header file `FruitBowl.h` to the generated code.

The class or template class you provide must meet the following requirements:

- The class must have a default constructor.
- The class must have a copy constructor.

If you use a class that also meets the following requirements

- The class has a single-argument constructor that takes the size of the sequence as an argument of unsigned integral
  type.
- The class has a member function `size` that returns the number of elements in the sequence as an unsigned integral
  type.
- The class provides a member function `swap` that swaps the contents of the sequence with another sequence of the same
  type.
- The class defines `iterator` and `const_iterator` types and provides `begin` and `end` member functions with the usual
  semantics; its iterators are comparable for equality and inequality.

then you do not need to provide code to marshal and unmarshal your custom sequence – Ice will do it automatically.

Less formally, this means that if the provided class looks like a `vector`, `list`, or `deque` with respect to these
points, you can use it as a custom sequence implementation without any additional coding.

### Span Mapping for Sequence Parameters

When you give a sequence parameter to Ice for marshaling, this parameter is passed by const reference. Take for example:

```slice
sequence<int> IntSeq;

interface Collector
{
    void reportValues(IntSeq values);
}
```

With the default mapping, the proxy functions look like:

```cpp
using IntSeq = std::vector<std::int32_t>;

class CollectorPrx : ...
{
public:
    void reportValues(const IntSeq& values, ...);
};
```

You can change this default mapping for “outgoing” parameters to a std::span with the metadata directive
`["cpp:view-type:std::span<const T>"]` (or `["cpp:view-type:std::span<T>"]`) where T is the mapped element type.

With our example above:

```slice
void reportValues(["cpp:view-type:std::span<const std::int32_t>"] IntSeq values);
```

changes the mapping to:

```cpp
void reportValues(std::span<const std::int32_t> values, ...);
```

This span mapping can help reduce copies in the caller.

{% callout type="info" %}

`std::span` requires C++20.

{% /callout %}

### Array Mapping for Sequence Parameters

In addition to the default and custom mappings of sequence types as a whole, you can use metadata `["cpp:array"]` to map
a single operation parameter of type sequence to a pair of pointers.

The array mapping for sequence parameters applies only to:

- In parameters, on the client-side and on the server-side
- Out and return parameters provided by the Ice runtime to [AMI](../operations#asynchronous-method-invocation-ami)
  callbacks
- Out and return parameters provided to [marshaled results](../slice-metadata-directives) or
  [AMD](../operations#asynchronous-method-dispatch-amd) callbacks

{% callout type="info" %}

The `["cpp:array"]` metadata affects many more parameters than the span mapping described earlier.

{% /callout %}

For example:

```slice
interface File
{
    void write(["cpp:array"] Ice::ByteSeq contents);
}
```

The `cpp:array` metadata directive instructs the compiler to map the `contents` parameter to a pair of pointers. With
this directive, the `write` function on the proxy has the following signature:

```cpp
void write(
    const std::pair<const std::byte*, const std::byte*>& contents,
    const Ice::Context& = Ice::noExplicitContext);
```

To pass a byte sequence to the server, you pass a pair of pointers; the first pointer points at the beginning of the
sequence, and the second pointer points one element past the end of the sequence.

Similarly, for the server side, the `write` method on the skeleton has the following signature:

```cpp
virtual void write(
    std::pair<const std::byte*, const std::byte*> contents,
    const Ice::Current& current) = 0;
```

The passed pointers denote the beginning and end of the sequence as a range `[first,` `last)` (that is, they use the
usual semantics for iterators).

The array mapping is useful to achieve zero-copy passing of sequences. The pointers point directly into the server-side
transport buffer when receiving a request; this allows the runtime to avoid creating a `vector` to pass to the operation
implementation, thereby avoiding both allocating memory for the sequence and copying its contents into that memory.

{% callout type="info" %}

You can use the array mapping for any sequence type. However, it provides a performance advantage only for byte
sequences (on all platforms) and for sequences of integral or floating point types on some platforms when you enable
unaligned reads by defining ICE_UNALIGNED.

{% /callout %}

{% /language-section %}
