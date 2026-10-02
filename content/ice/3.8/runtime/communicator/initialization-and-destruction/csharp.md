{% language-section name="lang-1" %}

You create a communicator by using its constructor, for example:

```csharp
await using var communicator = new Ice.Communicator(ref args);
```

`Ice.Communicator` constructor accepts the argument vector that is passed to `Main` by the operating system. The method
scans the argument vector for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime; any such options are removed from the argument vector so, when `Ice.Communicator` constructor returns,
the only options and arguments remaining are those that concern your application. If anything goes wrong during
initialization, it throws an exception.

{% callout type="warning" %}

[Ice.Communicator](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.Communicator.html) provides additional constructors
to pass other information to the Ice runtime.

{% /callout %}

`Ice.Communicator` implements both `IDisposable` and `IAsyncDisposable`. This allows you to create and cleanup your
communicator with `await using` in async applications (as shown above). In synchronous code, you can use instead:

```csharp
// In synchronous code.
using var communicator = new Ice.Communicator(ref args);
```

{% /language-section %}
