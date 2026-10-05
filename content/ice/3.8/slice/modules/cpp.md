{% language-section name="mapping" %}

A Slice module maps to a C++ namespace with the same name. The mapping preserves the nesting of the Slice definitions.
For example:

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

This definition maps to the corresponding C++ definition:

```cpp
namespace M1::M2
{
    // ...
}

// ...

namespace M1    // Reopen M1
{
    // ...
}
```

If a Slice module is reopened, the corresponding C++ namespace is reopened as well.

### Custom Mapping

The `cpp:identifier` metadata directive allows you to map a module to a C++ namespace or sub-namespace of your choice.
For example:

```slice
// module Time becomes namespace remote::clock in C++.
["cpp:identifier:remote::clock"]
module Time
{
    // ...
}
```

You can only use `cpp:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
