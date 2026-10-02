{% language-section name="lang-1" %}

## Obtaining the Local Process Facet

We [already showed](../using-the-admin-object) how to obtain a proxy for a remote administrative facet, but suppose you
want to interact with the facet in your local address space. The code below shows the necessary steps:

```csharp
if (communicator.findAdminFacet("Process") is Ice.Process process)
{
    ...
}
// else, the facet is not enabled
```

## Application Requirements for the Process Facet

The default implementation of the `Process` facet requires cooperation from an application in order to successfully
terminate a process. Specifically, the facet invokes `shutdown` on its [communicator](../../../runtime/communicator) and
assumes that the application uses this event as a signal to commence its termination procedure. For example, an
application typically uses a thread (often the main thread) to call the communicator operation `waitForShutdown`, which
blocks the calling thread until the communicator is shut down or destroyed. After `waitForShutdown` returns, the calling
thread can initiate a graceful shutdown of its process.

## Replacing the Process Facet

You can replace the default `Process` facet if your application requires a different scheme for gracefully shutting
itself down. To define your own facet, create a servant that implements the `Ice::Process` interface. As an example, the
C# servant definition shown below duplicates the functionality of the default `Process` facet:

```csharp
internal sealed class MyProcess : Ice.ProcessDisp_
{
    private readonly Ice.Communicator _communicator;

    public MyProcess(Ice.Communicator communicator) => _communicator = communicator;

    public override void shutdown(Ice.Current current) => _communicator.shutdown();

    public override void writeMessage(string message, int fd, Ice.Current current)
    {
        switch (fd)
        {
            case 1:
            {
                Console.Out.WriteLine(message);
                break;
            }
            case 2:
            {
                Console.Error.WriteLine(message);
                break;
            }
        }
    }
}
```

As you can see, the default implementation of `shutdown` simply shuts down the communicator, which initiates an orderly
termination of the Ice runtime's server-side components and prevents object adapters from dispatching any new requests.
You can add your own application-specific behavior to the `shutdown` method to ensure that your program terminates in a
timely manner.

{% callout type="info" %}

A servant must not call destroy on its communicator while dispatching a request.

{% /callout %}

To avoid the risk of a race condition, the recommended strategy for replacing the `Process` facet is to delay creation
of the administrative facets until after communicator initialization, so that your application has a chance to replace
the facet:

```config
# Delay admin object creation for admin object hosted in the Ice.Admin
# object adapter
Ice.Admin.DelayCreation=1
```

With [Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties) enabled, the application can safely
remove the default `Process` facet and install its own:

```csharp
Ice.Communicator communicator = ...;
communicator.removeAdminFacet("Process");
var myProcessFacet = new MyProcess(...);
communicator.addAdminFacet(myProcessFacet, "Process");
```

If you host the admin object in the `Ice.Admin` object adapter, the final step is to create the admin object by calling
`getAdmin` on the communicator. And if you host the admin object in your own object adapter, the final set is to create
the admin object with `createAdmin`.

{% /language-section %}
