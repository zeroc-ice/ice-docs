---
id: classes
language: swift
---

{% language-section name="language-mapping" %}

## Mapping for Classes

# Class Mapping

A Slice class is mapped to an open Swift class with the same name. The generated class contains a public stored property for each Slice field (just as for structures and exceptions). Consider the following class definition:

```slice
class TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
    string tz;          // e.g. GMT, PST, EDT...
}
```

The Slice compiler generates the following code for this definition:

```swift
open class TimeOfDay: Ice.Value {
    public var hour: Int16 = 0
    public var minute: Int16 = 0
    public var second: Int16 = 0
    public var tz: String = ""

    public required init() {}

    public init(hour: Int16, minute: Int16, second: Int16, tz: String) {
        self.hour = hour
        self.minute = minute
        self.second = second
        self.tz = tz
    }
    ...
}
```

There are a several things to note about the generated code:

1. The generated class `TimeOfDay` inherits from class `Ice.Value`. `Value` is the ultimate ancestor of all classes.
2. The generated class contains a public stored property for each Slice field.
3. The generated class provides a default initializer and a memberwise initializer. The default initializer initializes all stored properties to zero, nil or empty, as appropriate. See [Fields](../fields) for details.
{% /language-section %}
