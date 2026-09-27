{% language-section name="lang-1" %}

A Slice exception is mapped to a Swift class with the same name. This mapping is similar to the mapping of
[classes](../swift-mapping-for-classes).

Consider the following Slice exceptions:

```slice
module M
{
    exception GenericException
    {
        string reason;
    }

    exception BadTimeValException extends GenericException {}
}
```

The Slice compiler generates the following code for these exceptions:

```swift
open class GenericException: Ice.UserException, @unchecked Sendable {
    public var reason: String = ""

    public required init() {}

    public init(reason: String) {
        self.reason = reason
    }
    // ...
}

open class BadTimeValException: GenericException, @unchecked Sendable {
    // ...
}
```

There are a number of things to note about this generated code:

1. The generated class `GenericException` derives from `Ice.UserException`. The `Ice.UserException` class is the
   ultimate ancestor of all mapped exceptions. It conforms to the `Error` protocol.
2. The generated class contains a public property for each Slice field.
3. The generated class for `BadTimeValException` derives from the generated class `GenericException`.
4. The generated class a provides default initializer and a memberwise initializer; they are identical to the generated
   initializers for Slice classes.

{% /language-section %}
