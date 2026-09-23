{% language-section name="lang-1" %}

A Slice field maps to a Python dataclass field with the same name. The type of the Python field is the mapped Slice
type.

For example:

```
class Address { ... }

struct Person
{
    string name;
    Address address;
}
```

maps to:

```py
@dataclass
class Person:
    name: str = ""
    address: Address | None = None
```

## Optional Fields

An optional field maps to a Python field with the same name. The mapped field’s type is the mapped type or `None`, and
the tag value is not mapped to Python.

For example:

```
class C
{
    optional(2) string alternateName;
    optional(5) int overrideCode;
    optional(1) Widget* favoriteWidgetProxy;
}
```

maps to:

```py
@dataclass(eq=False)
class C(Value):
    alternateName: str | None = None
    overrideCode: int | None = None
    favoriteWidgetProxy: WidgetPrx | None = None
```

Optional and non-optional proxies are mapped the same way, as illustrated above. As a result, you cannot distinguish
between an optional proxy field that is not set and an optional proxy field set to null (None).

## Default Values

Slice default values map to default values in Python.

For example:

```
struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

maps to:

```py
@dataclass(order=True, unsafe_hash=True)
class Location:
    name: str = ""
    point: Point = field(default_factory=Point)
    display: bool = True
    source: str = "GPS"
```

When you don’t define a default value in Slice, and you initialize a field without providing a value for this field, the
generated code uses the following default:

| **Optional Field?** | **Slice Field Type**     | **Default Python Value**              |
| ------------------- | ------------------------ | ------------------------------------- |
| No                  | `string`                 | Empty string                          |
|                     | `enum`                   | First enumerator in enumeration       |
|                     | `struct`                 | New instance created with no argument |
|                     | Numeric                  | `0`                                   |
|                     | `bool`                   | `False`                               |
|                     | `sequence`, `dictionary` | Empty list, empty dictionary          |
|                     | `class`, proxy           | `None`                                |
| Yes                 | Any                      | `None`                                |

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
