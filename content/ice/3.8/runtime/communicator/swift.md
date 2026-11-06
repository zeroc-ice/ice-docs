{% language-section name="creating" %}

You create a communicator by calling
[Ice.initialize](<https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/initialize(_:)-9a9sk>), for example:

```swift
let communicator = try Ice.initialize(CommandLine.arguments)
```

`initialize` [sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument
that names an Ice property. This overload does not modify the argument array; the overload that takes an `inout` array
removes these arguments from it.

Call `destroy` on the communicator when you no longer need it. In a function, `defer` destroys it when the function
returns:

```swift
let communicator = try Ice.initialize(CommandLine.arguments)
defer {
    communicator.destroy()
}
```

{% /language-section %}

{% language-section name="initialization-data" %}

To combine initialization data with the command-line arguments, create the communicator's properties from the argument
array:

```swift
var initData = Ice.InitializationData()
initData.properties = try Ice.createProperties(CommandLine.arguments)
// ... set other initData fields ...
let communicator = try Ice.initialize(initData)
defer {
    communicator.destroy()
}
```

{% /language-section %}
