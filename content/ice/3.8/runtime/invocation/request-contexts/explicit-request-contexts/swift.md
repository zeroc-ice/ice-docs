{% language-section name="mapping" %}

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/swift/Ice/Context) provides a complete example of
using request context in Swift.

Using the Slice greeter definitions once again:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

A client application can set a request context to send additional metadata:

```swift
// We request a French greeting by setting the context parameter.
var greeting = try await greeter.greet(name, context: ["language": "fr"])
```

On the server side, the request context is available through the ctx member of the `Ice.Current` parameter:

```swift
func greet(name: String, current: Ice.Current) -> String {
    // We retrieve the value for the language entry in the context.
    let language = current.ctx["language"] ?? ""
    ...
}
```

{% /language-section %}
