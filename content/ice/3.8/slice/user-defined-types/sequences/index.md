---
title: Sequences
---

A sequence is an ordered list of zero or more elements of the same type.

## Sequence Syntax

A sequence definition consists of the `sequence` keyword, its element type, and a name:

```slice
module M
{
    enum Fruit { Apple, Pear, Orange }
    sequence<Fruit> FruitPlatter;
}
```

The element type can be any Slice type, including a sequence:

```slice
module M
{
    sequence<FruitPlatter> FruitBanquet;
}
```

## Language Mapping

{% language-section name="mapping" /%}
