{% language-section name="mapping" %}

You create a communicator by using its constructor, for example:

```csharp
await using var communicator = new Ice.Communicator(ref args);
```

The constructor accepts the command-line arguments that are passed to `Main`. It scans them for any
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime; any such options are removed from the arguments so, when the constructor returns, the only options and
arguments remaining are those that concern your application. If anything goes wrong during initialization, it throws an
exception. To pass other options to the Ice runtime, use the constructor that accepts an
[InitializationData](api:Ice/InitializationData).

`Ice.Communicator` implements both `IDisposable` and `IAsyncDisposable`. This allows you to create and clean up your
communicator with `await using` in async applications (as shown above). In synchronous code, you can use instead:

```csharp
// In synchronous code.
using var communicator = new Ice.Communicator(ref args);
```

{% /language-section %}
