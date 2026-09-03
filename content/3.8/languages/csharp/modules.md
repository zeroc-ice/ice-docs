---
id: modules
language: csharp
---

{% language-section name="lang-1" %}
A Slice module maps to a C# namespace with the same name. The mapping preserves the nesting of the Slice definitions. For example:

```slice
module M1::M2 
{
    // ...
}

// ...

module M1    // Reopen M1
{
    // ...
}
```

This definition maps to the corresponding C# definition:

```csharp
namespace M1.M2
{
    // ...
}

// ...

namespace M1    // Reopen M1
{
    // ...
}
```

If a Slice module is reopened, the corresponding C# namespace is reopened as well.

### Custom Mapping

The `cs:identifier` metadata directive allows you to map a module to a C# namespace or sub-namespace of your choice. For example:

```slice
// module Time becomes namespace Remote.Clock in C#.
["cs:identifier:Remote.Clock"]
module Time
{
    // ...
}
```

You can only use `cs:identifier` on a module with a simple name - this metadata directive is not compatible with the nested module syntax.
{% /language-section %}
