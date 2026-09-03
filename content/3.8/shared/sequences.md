---
id: sequences
title: Sequences
---

# Sequence Syntax

Sequences are variable-length collections of elements:

```slice
module M
{
    sequence<Fruit> FruitPlatter;
}
```

A sequence can be empty — that is, it can contain no elements, or it can hold any number of elements up to the memory limits of your platform.

Sequences can contain elements that are themselves sequences. This arrangement allows you to create lists of lists:

```slice
module M
{
    sequence<FruitPlatter> FruitBanquet;
}
```

Sequences are used to model a variety of collections, such as vectors, lists, queues, sets, bags, or trees. (It is up to the application to decide whether or not order is important; by discarding order, a sequence serves as a set or bag.)

# Language Mapping

{% language-section name="lang-1" /%}
