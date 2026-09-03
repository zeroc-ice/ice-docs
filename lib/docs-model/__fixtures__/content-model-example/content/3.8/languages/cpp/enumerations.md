---
id: enumerations
language: cpp
---

{% language-section name="mapping" %}

## C++ mapping

A Slice enumeration maps to a C++ `enum class` with the same enumerators:

```cpp
enum class Fruit { Apple, Pear, Orange };
```

The generated type is scoped, so you refer to an enumerator as `Fruit::Apple`.
Use it like any other value — this snippet is pulled from a compilable example:

{% snippet file="examples/cpp/enumerations.cpp" name="fruit-usage" /%}

{% /language-section %}
