{% language-section name="mapping" %}

You create a communicator by calling
[Ice.initialize](<https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/initialize(_:)-9a9sk>), for example:

```swift
let communicator = try Ice.initialize(CommandLine.arguments)
```

`initialize` scans the argument array for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime. If anything goes wrong during initialization, `initialize` throws an exception.

{% callout type="note" %}

The `initialize` shown above does not modify the argument array. You can use another overload of `initialize` that
removes all Ice-related options from the argument array.

{% /callout %}

Once you no longer need a `Communicator`, you must call `destroy` on this `Communicator`. The `destroy` method is
responsible for cleaning up the communicator. In particular, in an Ice server, `destroy` waits for operation
implementations that are still executing to complete. In addition, `destroy` ensures that any outstanding threads are
joined with and reclaims a number of operating system resources, such as file descriptors and memory. Never allow your
application to terminate without calling `destroy` first.

The general shape of a simple command-line Swift application becomes:

```swift
let communicator = try Ice.initialize(CommandLine.arguments)
defer {
    communicator.destroy()
}
```

{% /language-section %}
