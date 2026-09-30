{% language-section name="lang-1" %}

A Slice field maps to a C++ data member with the same name. The type of the C++ data member is the default,
memory-owning, mapping of the Slice type.

For example:

```slice
struct Person
{
    string name;
}
```

maps to:

```cpp
struct Person
{
    std::string name; // not std::string_view
    ...
};
```

### Field with a Class Type

A Slice field with a class type maps to a C++ data member with a shared pointer type. For example:

```slice
class Address { ... }

struct Person
{
    string name;
    Address address;
}
```

maps to:

```cpp
class Address { ... };
using AddressPtr = std::shared_ptr<Address>;

struct Person
{
    std::string name;
    AddressPtr address; // can be null
    ...
};
```

### Field with a Proxy Type

A Slice field with a proxy type maps to a C++ data member with a `std::optional<T>` type. For example:

```slice
interface Widget { ... }

struct Person
{
    Widget* favoriteWidgetProxy;
}
```

maps to:

```cpp
class WidgetPrx { ... };

struct Person
{
    std::optional<WidgetPrx> favoriteWidgetProxy; // can be nullopt
    ...
};
```

### Optional Fields

An optional field maps to a C++ data member with the same name. The data member's type is the mapped type, wrapped in a
`std::optional`. The tag value is not mapped to C++.

For example:

```slice
class C
{
    optional(2) string alternateName;
    optional(5) int overrideCode;
    optional(1) Widget* favoriteWidgetProxy;
}
```

maps to:

```cpp
class C
{
    std::optional<std::string> alternateName;
    std::optional<std::int32_t> overrideCode;
    std::optional<WidgetPrx> favoriteWidgetProxy; // single optional
    ...
};
```

Proxies are not wrapped twice in `std::optional`, as illustrated above. As a result, you cannot distinguish between an
optional proxy field that is not set and an optional proxy field set to null.

### Default Values

Slice default values map to default member initializers in C++.

For example:

```slice
struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

maps to:

```cpp
struct Location
{
    std::string name;
    Point point;
    bool display{true};
    std::string source{"GPS"};
    ...
};
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
