{% language-section name="mapping" %}

A Slice structure maps to a Swift structure when this Slice structure does not have (recursively) any Slice class field.
Conversely, a Slice structure maps to a Swift class when this Slice structure has (recursively) one or more Slice class
field.

### Mapping to Swift Struct

Consider the following Slice structure:

```slice
struct Point
{
    double x;
    double y;
}
```

This simple structure does not have any Slice class field so it maps to a public Swift structure:

```swift
public struct Point {
    public var x: Double = 0
    public var y: Double = 0

    public init() {}

    public init(x: Double, y: Double) {
        self.x = x
        self.y = y
    }
}
```

For each field in the Slice definition, the Swift structure contains a corresponding public stored property of the same
name.

When all the stored properties of the generated Swift structure are `Hashable`, the generated structure is itself
hashable. For example:

```slice
struct TimeOfDay
{
    short hour;
    short minute;
    short second;
}
```

The corresponding Swift structure conforms to `Hashable`:

```swift
public struct TimeOfDay: Hashable {
    public var hour: Int16 = 0
    public var minute: Int16 = 0
    public var second: Int16 = 0

    public init() {}

    public init(hour: Int16, minute: Int16, second: Int16) {
        self.hour = hour
        self.minute = minute
        self.second = second
    }
}
```

### Mapping to Swift Class

A Slice structure with a field of a class type is mapped to a Swift class. Take the Entry structure below:

```slice
class Data
{
    ...
}

struct Entry
{
    int key;
    Data value;
}
```

`Entry` is mapped to a public Swift class:

```swift
public class Entry {
    public var key: Int32 = 0
    public var value: Data? = nil

    public init() {}

    public init(key: Int32, value: Data?) {
        self.key = key
        self.value = value
    }
}
```

For each field in the Slice definition, the Swift structure contains a corresponding public stored property of the same
name. Fields with type class or proxy are mapped to Swift optionals: the mapped type for `value` in the example above is
`Data?`.

{% callout type="tip" %}

A Slice structure is mapped to a Swift class when this Slice structure contains a class field anywhere: it can be a
direct field or a nested field such as:

```slice
class Data
{
    ...
}

struct Entry
{
    int key;
    Data value;
}

sequence<Entry> EntryList;

// Mapped to a Swift class, since entries contains indirectly a class field.
struct Record
{
    string name;
    EntryList entries;
}
```

{% /callout %}

### Generated Initializers

The mapped Swift struct or class has always two public initializers:

- a memberwise initializer that initializes all properties explicitly
- a parameterless initializer that assigns default values to all properties (see [Fields](../../fields))

{% /language-section %}
