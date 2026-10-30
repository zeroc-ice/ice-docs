{% language-section name="mapping" %}

You create a communicator by calling
[Ice.initialize](<https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/initialize(_:)-9a9sk>), for example:

```swift
let communicator = try Ice.initialize(CommandLine.arguments)
```

`initialize` scans the argument array for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime. If anything goes wrong during initialization, `initialize` throws an exception.

This `initialize` does not modify the argument array; another overload of `initialize` removes the Ice options from the
array.

Call `destroy` on the communicator when you no longer need it. In a function, `defer` destroys it when the function
returns:

```swift
let communicator = try Ice.initialize(CommandLine.arguments)
defer {
    communicator.destroy()
}
```

{% /language-section %}
