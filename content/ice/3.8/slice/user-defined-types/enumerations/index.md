---
title: Enumerations
---

## Enumeration Syntax and Semantics

An enumeration defines a set of named values, its enumerators:

```slice
module M
{
    enum Fruit { Apple, Pear, Orange }
}
```

This definition introduces a new type named `Fruit`. By default, the first enumerator has a value of zero, with
sequentially increasing values for subsequent enumerators.

A Slice enum type introduces a new namespace scope, so the following is legal:

```slice
module M
{
    enum Fruit { Apple, Pear, Orange }
    enum ComputerBrands { Apple, Dell, HP, Lenovo }
}
```

The example below shows how to refer to an enumerator from a different scope:

```slice
module M
{
    enum Color { Red, Green, Blue }
}

module N
{
    struct Pixel
    {
        M::Color c = Blue;
    }
}
```

Slice does not permit empty enumerations.

{% callout type="note" %}

In Ice releases prior to Ice 3.7, an enum type did not create a new namespace and its enumerators were in the same
namespace as the enum type itself. With these releases, you had to select longer enumerator names to avoid a naming
clash.

{% /callout %}

## Custom Enumerator Values

Slice also permits you to assign custom values to enumerators:

```slice
const int PearValue = 7;
enum Fruit { Apple = 0, Pear = PearValue, Orange }
```

Custom values must be unique and non-negative, and may refer to Slice constants of integer types. If no custom value is
specified for an enumerator, its value is one greater than the enumerator that immediately precedes it. In the example
above, `Orange` has the value 8.

The maximum value for an enumerator value is the same as the maximum value for `int`, 2³¹ - 1.

Slice does not require custom enumerator values to be declared in increasing order:

```slice
enum Fruit { Apple = 5, Pear = 3, Orange = 1 }   // Legal
```

The language mapping determines whether a program can compare two enumerators for order, and whether such a comparison
follows the enumerators' values or their declaration order.

{% callout type="warning" %}

For an application that is still using version 1.0 of the [Ice encoding](../../../encoding/basic-data-encoding),
changing the definition of an enumerated type **may** break backward compatibility with existing applications. For more
information, please refer to the [encoding rules](../../../encoding/basic-data-encoding) for enumerators.

{% /callout %}

## Language Mapping

{% language-section name="mapping" /%}

## See Also

- [Constants and Literals](../../constants-and-literals)
