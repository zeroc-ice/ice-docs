---
title: Sequences
---

A sequence is an ordered collection of elements of the same type, in which an element can appear more than once. A
sequence can be empty.

## Sequence Syntax

You define a sequence with the `sequence` keyword and its element type:

```slice
module M
{
    enum Fruit { Apple, Pear, Orange }
    sequence<Fruit> FruitPlatter;
}
```

The element type can itself be a sequence:

```slice
module M
{
    sequence<FruitPlatter> FruitBanquet;
}
```

## Language Mapping

{% language-section name="mapping" /%}
