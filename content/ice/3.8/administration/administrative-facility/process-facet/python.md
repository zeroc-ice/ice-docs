{% language-section name="lang-1" %}

## Obtaining the Local Process Facet

We [already showed](../using-the-admin-object) how to obtain a proxy for a remote administrative facet, but suppose you
want to interact with the facet in your local address space. The code below shows the necessary steps:

The built-in process facet servant is not exposed in the Python mapping; Python applications can access it only via its
proxy.

## Application Requirements for the Process Facet

The default implementation of the `Process` facet requires cooperation from an application in order to successfully
terminate a process. Specifically, the facet invokes `shutdown` on its [communicator](../communicator) and assumes that
the application uses this event as a signal to commence its termination procedure. For example, an application typically
uses a thread (often the main thread) to call the communicator operation `waitForShutdown`, which blocks the calling
thread until the communicator is shut down or destroyed. After `waitForShutdown` returns, the calling thread can
initiate a graceful shutdown of its process.

## Replacing the Process Facet

You can replace the default `Process` facet if your application requires a different scheme for gracefully shutting
itself down. To define your own facet, create a servant that implements the `Ice::Process` interface. As an example, the
Python servant definition shown below duplicates the functionality of the default `Process` facet:

```py
class MyProcess(Ice.Process):
    def __init__(self, communicator: Ice.Communicator):
        self._communicator = communicator

    def shutdown(self, current: Ice.Current) -> None:
        self._communicator.shutdown()

    def writeMessage(self, message: str, fd: int, current: Ice.Current) -> None:
        if fd == 1:
            print(message)
        elif fd == 2:
            print(message, file=sys.stderr)
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

With [Ice.Admin.DelayCreation](../ice-admin-properties) enabled, the application can safely remove the default `Process`
facet and install its own:

```py
communicator = ...
communicator.removeAdminFacet("Process")
myProcessFacet = MyProcess(...)
communicator.addAdminFacet(myProcessFacet, "Process")
```

If you host the admin object in the `Ice.Admin` object adapter, the final step is to create the admin object by calling
`getAdmin` on the communicator. And if you host the admin object in your own object adapter, the final set is to create
the admin object with `createAdmin`.

{% /language-section %}
