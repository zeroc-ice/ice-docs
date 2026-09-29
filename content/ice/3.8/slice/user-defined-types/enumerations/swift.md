{% language-section name="lang-1" %}

A Slice enumeration maps to a Swift enumeration that stores raw values of type `UInt8` or `Int32`. For example:

```slice
enum Fruit { Apple, Pear, Orange }
```

The mapped Swift enumeration is very similar:

```swift
public enum Fruit: UInt8 {
    case Apple = 0
    case Pear = 1
    case Orange = 2
    public init() {
        self = .Apple
    }
}
```

The raw value type for the generated enumeration is `UInt8` when the largest enumerator value is 255 or less; otherwise,
the raw value type is `Int32`.

Suppose we modify the Slice definition to include a custom enumerator value:

```slice
enum Fruit { Apple, Pear = 3, Orange }
```

The generated Swift definition now includes adjusted values for each enumerators:

```swift
public enum Fruit: UInt8 {
    case Apple = 0
    case Pear = 3
    case Orange = 4
    public init() {
        self = .Apple
    }
}
```

{% /language-section %}
