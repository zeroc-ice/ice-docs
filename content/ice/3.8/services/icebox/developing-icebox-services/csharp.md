{% language-section name="mapping" %}

The example we present here is taken from the `IceBox/Greeter` demo program.

Add a reference to the `ZeroC.IceBox` NuGet package, version 3.8.x, to your service project. This package provides the
`IceBox.Service` interface.

The class definition for our service is quite straightforward:

```csharp
public class GreeterService : IceBox.Service
{
    private Ice.ObjectAdapter? _adapter;

    public void start(string name, Ice.Communicator communicator, string[] args)
    {
        Debug.Assert(_adapter is null);
        _adapter = communicator.createObjectAdapterWithEndpoints(
            "GreeterAdapter",
            "tcp -p 4061");

        _adapter.add(new Chatbot("Syd"), new Ice.Identity { name = "greeter" });
        _adapter.activate();
        Console.WriteLine("Listening on port 4061...");
    }

    public void stop()
    {
        Console.WriteLine("Shutting down...");

        Debug.Assert(_adapter is not null);
        _adapter.destroy();
        _adapter = null;
    }
}
```

The `start` method creates an object adapter “GreeterAdapter”, activates a single servant of type `Chatbot` (not shown),
and activates the object adapter. The `stop` method simply destroys the object adapter.

### C# Service Entry Point

The last piece of the puzzle is the _entry point_, which the IceBox server calls to create an instance of the service.

IceBox requires a service implementation to have a public parameterless constructor or a public constructor with a
single `Communicator` parameter. This is the C# entry point for IceBox: the IceBox server dynamically loads the service
implementation class from an assembly and calls this public constructor to create an instance of the service.

{% /language-section %}
