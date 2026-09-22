---
id: enumerations
language: cpp
---

{% language-section name="lang-1" %}

A Slice enumeration maps to the corresponding `enum class` in C++.

For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

The generated C++ enumeration is:

```cpp
enum class Fruit : std::uint8_t { Apple, Pear, Orange };
```

The underlying type is `std::uint8_t` when the enumeration's largest enumerator value is not greater than 254, otherwise
it's `std::int32_t`.

Suppose we modify the Slice definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated C++ definition now includes an explicit initializer for every enumerator:

```cpp
enum class Fruit : std::uint8_t { Apple = 0, Pear = 3, Orange = 4 };
```

{% callout type="tip" %}

If you use custom enumerator values and 0 does not correspond to any enumerator, you must be particularly careful with
structs, classes or exceptions that have such as enumeration as a field. The default constructor of such a struct, class
or exception will zero-initialize this data member, and you will get a marshal error if you attempt to send this invalid
enumerator through Ice.

{% /callout %}

## Printing Enumerators

The Slice compiler also generates `operator<<` to “print” the enumerators of the C++ enum. For example:

```cpp
std::ostream& operator<<(std::ostream& os, Fruit value);
```

You can suppress the generation of this operator, and tell the Slice compiler you’ll provide your own custom operator<<,
with the `”cpp:custom-print”` metadata. For example:

```
["cpp:custom-print"] // we provide our own custom operator<< for this enum
enum Fruit { Apple, Pear = 3, Orange }
```

{% /language-section %}
