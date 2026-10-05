{% language-section name="mapping" %}

A top-level Slice module maps to a Swift module with the same name as the Slice module.

Keep in mind that a Swift module is a unit of code distribution that you define when your build and organize your code.
It’s not a namespace construct like in C++ or C#.

Take the `Greeter.ice` Slice file:

```slice
module VisitorCenter
{
   interface Greeter { ... }
}
```

When the Slice to Swift compiler (`slice2swift`) compiles this file, it does not generate anything for `VisitorCenter`.

The mapped Swift module is used only when you make cross-module references, as in:

```slice
module VisitorCenter
{
   interface Greeter { ... }
}

module TourOperator
{
    struct PointOfInterest
    {
        // A cross-module reference.
        VisitorCenter::Greeter* greeter;
    }
}
```

With this example, the mapped Swift `greeter` property is a `VisitorCenter.GreeterPrx?`.

A nested Slice module is used as prefix for the mapped Swift types in that module. For example:

```slice
module M1::M2
{
    interface A { ... }
}

// ...

module M1    // Reopen M1
{
    // More definitions for M1 here...
    interface B { ... }
}
```

This definition maps to the corresponding Swift definitions:

```swift
public protocol M2APrx {
    ...
}

public protocol BPrx {
    ...
}
```

There is no mapped Swift module in this case.

### Custom Mapping

The `swift:identifier` metadata directive allows you to map a top-level module to a Swift module of your choice. For a
nested module, `swift:identifier` remaps the prefix. For example:

```slice
// module Time becomes Swift module Clock in cross-module references.
["swift:identifier:Clock"]
module Time
{
   // ...
}
```

You can only use `swift:identifier` on a module with a simple name - this metadata directive is not compatible with the
nested module syntax.

{% /language-section %}
