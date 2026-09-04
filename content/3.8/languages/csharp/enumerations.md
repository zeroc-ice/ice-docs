---
id: enumerations
language: csharp
---

{% language-section name="lang-1" %}

A Slice enumeration maps to the corresponding enumeration in C#. For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

Not surprisingly, the generated C# definition is very similar:

```csharp
public enum Fruit { Apple, Pear, Orange }
```

Suppose we modify the Slice definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated C# definition now includes an explicit initializer for every enumerator:

```csharp
public enum Fruit { Apple = 0, Pear = 3, Orange = 4 }
```

{% /language-section %}
