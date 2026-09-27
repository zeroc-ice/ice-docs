{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

A Slice field maps to a Swift property with the same name. The type of the property is the mapped Slice type. When the
Slice field is non-optional, the property type is non-optional as well, except for class and proxy fields.

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

```swift
public final class Person {
    public var name: String = ""       // non-optional String
    public var address: Address? = nil // optional Address
    ...
}
```

## Optional Fields

An optional field maps to a Swift stored property with the same name. The mapped property’s type is optional. The tag
value is not mapped to Swift.

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

```swift
open class C: Ice.Value {
    public var alternateName: String? = nil
    public var overrideCode: Int32? = nil
    public var favoriteWidgetProxy: WidgetPrx? = nil
    ...
}
```

Optional and non-optional proxies are mapped the same way, as illustrated above. As a result, you cannot distinguish
between an optional proxy property that is not set and an optional proxy property set to nil.

## Default Values

Slice default values map to default property values in Swift.

For example:

```
struct Location
{
    string name;
    Point point;
    bool display = true;
    string source = "GPS";
}
```

maps to:

```swift
public struct Location: Hashable, Sendable {
    public var name: String = ""
    public var point: Point = Point()
    public var display: Bool = true
    public var source: String = "GPS"
    ...
}
```

When you don’t define a default value in Slice, and you initialize a property without providing a value for this
property, the generated code uses the following default:

| **Optional Field?** | **Slice Field Type** | **Default Swift Value**               |
| ------------------- | -------------------- | ------------------------------------- |
| No                  | `string`             | Empty string                          |
|                     | `enum`               | First enumerator in enumeration       |
|                     | `struct`             | New instance created with no argument |
|                     | Numeric              | `0`                                   |
|                     | `bool`               | `false`                               |
|                     | `sequence`           | Empty array                           |
|                     | `dictionary`         | Empty dictionary                      |
|                     | `class`, proxy       | `nil`                                 |
| Yes                 | Any                  | `nil`                                 |

{% /language-section %}
