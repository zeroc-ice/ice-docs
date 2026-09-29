{% language-section name="lang-1" %}

A Slice field maps to a C# field, with by default the same name. The type of the C# field is the mapped Slice type.

In C#, we often remap the field name with `cs:identifier` to convert the name for Pascal case. For example:

```slice
class Address { ... }

struct Person
{
    ["cs:identifier:Name"]
    string name;

    ["cs:identifier:Address"]
    Address address;
}
```

maps to:

```csharp
public sealed partial record class Person
{
    public string Name = ""; // Slice string maps to C# string
    public Address? Address; // Slice Address maps the nullable C# Address
    ...
}
```

## Optional Fields

An optional field maps to a C# field with the same name. The mapped field’s type is nullable, and the tag value is not
mapped to C#.

For example:

```slice
class C
{
    ["cs:identifier:AlternateName"]
    optional(2) string alternateName;

    ["cs:identifier:OverrideCode"]
    optional(5) int overrideCode;

    ["cs:identifier:FavoriteWidgetProxy"]
    optional(1) Widget* favoriteWidgetProxy;
}
```

maps to:

```csharp
public partial class C : Ice.Value
{
    public string? AlternateName;
    public int? OverrideCode;
    public WidgetPrx? FavoriteWidgetProxy;
    ...
}
```

Optional and non-optional proxies are mapped the same way, as illustrated above. As a result, you cannot distinguish
between an optional proxy field that is not set and an optional proxy field set to null.

## Default Values

Slice default values map to default values in C#.

For example:

```slice
struct Location
{
    ["cs:identifier:Name"]
    string name;

    ["cs:identifier:Point"]
    Point point;

    ["cs:identifier:Display"]
    bool display = true;

    ["cs:identifier:Source"]
    string source = "GPS";
}
```

maps to:

```csharp
public sealed partial record class Location
{
    public string Name = "";
    public Point Point;
    public bool Display = true;
    public string Source = "GPS";
    ...
}
```

When you don’t define a default value in Slice, and you initialize a field without providing a value for this field, the
generated code uses the following default:

| **Optional Field?** | **Slice Field Type**     | **C# Default Value**                                                                                    |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| No                  | `string`                 | Empty string                                                                                            |
|                     | `enum`                   | `default`                                                                                               |
|                     | `struct`                 | `default` (when the struct is mapped to a C# struct), `null!` (when the struct is mapped to a C# class) |
|                     | Numeric                  | `0`                                                                                                     |
|                     | `bool`                   | `false`                                                                                                 |
|                     | `sequence`, `dictionary` | `null!`                                                                                                 |
|                     | `class`, proxy           | `null`                                                                                                  |
| Yes                 | Any                      | `null`                                                                                                  |

{% callout type="info" %}

The generated constructor for a struct does not initialize any field to `null!`: you always have to provide values for
these fields.

{% /callout %}

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
