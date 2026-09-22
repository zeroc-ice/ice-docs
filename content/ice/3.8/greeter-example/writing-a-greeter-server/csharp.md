---
title: Writing a Greeter Server
---

This page provides a step-by-step guide to writing the server-side of our C# Greeter application.

The server consists of:

- A C# class that implements the `Greeter` interface we defined earlier in Slice
- an Ice object adapter that accepts TCP connections from clients, and later routes requests received over these
  connections to our Greeter implementation

You can find the complete source code for this example in the
[ice-demos repository](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Ice/Greeter).

## Greeter Implementation

### Compile Slice File with Slice Compiler

The first step when writing a C# application with Ice is to compile the Slice definitions for this application with the
Slice to C# compiler (`slice2cs`).

Here, we compile the `Greeter.ice` Slice file we wrote earlier. We recommend that you include this Slice compiler step
in your build project, like we demonstrate for the C# demo programs.

This generates a single file named `Greeter.cs` which provides the `GreeterDisp_` abstract base class we implement in
the code below.

### Implement Servant Class

We implement the `GreeterDisp_` abstract base class with a C# class, `Chatbot`. We call this implementation a servant
class, or servant for short. We define our `Chatbot` in `Chatbot.cs`:

```csharp
using VisitorCenter;

namespace Server;

internal class Chatbot : GreeterDisp_
{
    public override string Greet(string name, Ice.Current current)
    {
        Console.WriteLine($"Dispatching greet request {{ name = '{name}' }}");
        return $"Hello, {name}!";
    }
}
```

Since the `Greeter` Slice interface only has one operation (`greet`), there is only one method that `Chatbot` needs to
implement. You can see our implementation takes a `name` parameter, and returns a greeting based on the provided `name`,
matching what was specified in our Slice file.

{% callout type="info" %}

It is normal for servants like `Chatbot` to contain fields and other methods in addition to the needed ones from the
generated base class. Due to our application’s simplicity, we don’t here though.

{% /callout %}

## Main Server Program

We’ll write our main server code in a file named `Program.cs`. The logic in this file can be broken down into four
pieces:

### Create a Communicator

First, we create a Communicator using its constructor:

```csharp
await using var communicator = new Ice.Communicator(ref args);
```

The communicator is our main entry point into the Ice runtime. In this simple server application, we need this
communicator to create an object adapter and nothing else (see next step).

It is important to make sure that your communicator is properly disposed when no longer needed. This ensures that
network connections are gracefully closed, threads are joined, and other important clean-up occurs. The easiest way to
do this is with an `await using` like we do here.

### Create an Object Adapter

Next, we create an object adapter using our communicator:

```csharp
Ice.ObjectAdapter adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

An object adapter serves two purposes in Ice:

- it accepts connections from clients
- it receives requests over these connections and routes them to servants based on the object identities carried by
  these requests

In this example, we create an object adapter named `GreeterAdapter` which listens for TCP connections on port 4061, and
later receives requests over these connections.

We then register our `Chatbot` servant with this adapter under the identity `greeter`:

```csharp
adapter.add(new Server.Chatbot(), new Ice.Identity { name = "greeter" });
```

Later on, when the object adapter receives a request with identity “greeter”, it will route this request to our
`Chatbot` instance. It is therefore essential that the client uses the same identity in its proxy.

### Activate the Object Adapter

At this point, our object adapter does not accept connections yet. A client attempting to connect would get a
`ConnectTimeoutException`.

We call `activate` to start accepting connections:

```csharp
adapter.activate();
Console.WriteLine("Listening on port 4061...");
```

Our server is now active, waiting for connections and requests from clients, and dispatching requests for “greeter” to
our `Chatbot` servant.

### Keep running until Ctrl+C

It is essential to keep the server running and not fall off main prematurely. We use the following technique to achieve
this goal:

- wait in main until an event occurs
- register a callback that runs upon Ctrl+C and triggers this event

The event we chose is “the communicator was shut down”. But you could pick any other event.

The Ctrl+C handling is courtesy of `Console.CancelKeyPress`. We add a callback function which runs when it intercepts a
signal. In this case, we want to shut down the communicator:

```csharp
Console.CancelKeyPress += (sender, eventArgs) =>
{
    eventArgs.Cancel = true; // don't terminate the process
    Console.WriteLine("Caught Ctrl+C, shutting down...");
    communicator.shutdown(); // starts shutting down
};
```

Next, we block until the communicator is shut down:

```csharp
await communicator.shutdownCompleted;
```

Finally, after the communicator is shut down, the communicator is disposed (because we used `await using`), and then our
application exits.

## Running the Server

After building the server (see the demo’s
[README](https://github.com/zeroc-ice/ice-demos/blob/3.8/csharp/Ice/Greeter/README.md) for instructions), you can run it
with `dotnet`:

```shell
dotnet run
```
