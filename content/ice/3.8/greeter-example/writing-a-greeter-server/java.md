---
title: Writing a Greeter Server
---

This page provides a step-by-step guide to writing the server-side of our Java Greeter application.

The server consists of:

- A Java class that implements the `Greeter` interface we defined earlier in Slice
- an Ice object adapter that accepts TCP connections from clients, and later routes requests received over these
  connections to our Greeter implementation

You can find the complete source code for this example in the
[ice-demos repository](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Ice/greeter).

## Greeter Implementation

### Compile Slice File with Slice Compiler

The first step when writing a Java application with Ice is to compile the Slice definitions for this application with
the Slice to Java compiler (`slice2java`).

Here, we compile the `Greeter.ice` Slice file we wrote earlier. We recommend that you include this Slice compiler step
in your build project, like we demonstrate for the Java demo programs.

The Slice compiler produces 4 files in a folder named `com/example/visitorcenter`:

- `Greeter.java` provides the `Greeter` interface we implement in the code below.
- `AsyncGreeter.java` provides the `AsyncGreeter` interface, which a servant implements instead of `Greeter` to dispatch
  requests asynchronously.
- `GreeterPrx.java` provides a `Greeter` proxy used by the client-side of this application.
- `_GreeterPrxI.java` contains internal code for `GreeterPrx`.

### Implement Servant

We implement the `Greeter` interface with a Java class: `Chatbot`. We call this implementation a servant class, or
servant for short. `Chatbot` is defined in `Chatbot.java`:

```java
package com.example.ice.greeter.server;

import com.example.visitorcenter.Greeter;
import com.zeroc.Ice.Current;

class Chatbot implements Greeter {
    @Override
    public String greet(String name, Current current) {
        System.out.println("Dispatching greet request { name = '" + name + "' }");
        return "Hello, " + name + "!";
    }
}
```

Since the `Greeter` Slice interface only has one operation (`greet`), there is only one method that `Chatbot` needs to
implement. You can see our implementation takes a `name` parameter, and returns a greeting based on the provided `name`,
matching what was specified in our Slice file.

{% callout type="note" %}

It is normal for servants like `Chatbot` to contain fields and other methods in addition to the needed ones from the
generated base class. Due to our application’s simplicity, we don’t here though.

{% /callout %}

## Main Server Program

We write our main server code in a file named `Server.java` that starts out looking like:

```java
package com.example.ice.greeter.server;

import com.zeroc.Ice.Communicator;
import com.zeroc.Ice.Identity;
import com.zeroc.Ice.ObjectAdapter;

class Server {
    public static void main(String[] args) {
        // ...
    }
}
```

Our `main` function can be broken down into 4 pieces:

### 1. Create a Communicator

First, we create a Communicator using its constructor:

```java
    public static void main(String[] args) {
        try (Communicator communicator = new Communicator(args)) {
            // ...
        }
    }
```

The communicator is our main entry point into the Ice runtime. In this simple server application, we need this
communicator to create an object adapter and nothing else (see next step).

It is important to make sure that your communicator is properly closed when no longer needed. This ensures that network
connections are gracefully closed, threads are joined, and other important clean-up occurs. The easiest way to do this
is with a try-with-resources statement like we do here.

### 2. Create an Object Adapter

Next, we create an object adapter using our communicator:

```java
ObjectAdapter adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter", "tcp -p 4061");
```

An object adapter serves two purposes in Ice:

- it accepts connections from clients
- it receives requests over these connections and routes them to servants based on the object identities carried by
  these requests

In this example, we create an object adapter named `GreeterAdapter` which listens for TCP connections on port 4061, and
later receives requests over these connections.

We then register our Chatbot servant with this adapter under the identity `greeter`:

```java
adapter.add(new Chatbot(), new Identity("greeter", ""));
```

Later on, when the object adapter receives a request with identity “greeter”, it will route this request to our
`Chatbot` instance. It is therefore essential that the client uses the same identity in its proxy.

### 3. Activate the Object Adapter

At this point, our object adapter does not accept connections yet. A client attempting to connect would get a
`ConnectTimeoutException`.

We call `activate` to start accepting connections:

```java
adapter.activate();
System.out.println("Listening on port 4061...");
```

Our server is now active, waiting for connections and requests from clients, and dispatching requests for “greeter” to
our `Chatbot` servant.

### 4. Keep Running Until Ctrl+C

It is essential to keep the server running and not fall off main prematurely. We use the following technique to achieve
this goal:

- wait in the main thread until an event occurs
- register a shutdown hook that will run upon Ctrl+C and trigger this event

The event we chose is “the communicator was shut down”. But you could pick any other event.

We register a shutdown hook that calls `shutdown` on the communicator, and then waits for the main thread to finish, to
ensure a clean shutdown. The hook runs in its own thread, so we capture the main thread before we register the hook:

```java
Thread mainThread = Thread.currentThread();
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    System.out.println("Caught Ctrl+C, shutting down...");
    communicator.shutdown();
    try {
        mainThread.join(); // Wait until the main thread completes.
    } catch (InterruptedException ignored) {}
}));
```

Next, after registering this hook, we block the main thread until the communicator is shut down:

```java
communicator.waitForShutdown();
```

Once the communicator is shut down, we reach the end of our try-with-resources block, the communicator gets closed, and
the application exits.

## Running the Server

After building the server (see the demo’s
[README](https://github.com/zeroc-ice/ice-demos/blob/3.8/java/Ice/greeter/README.md) for instructions), you can run it
with the launcher script that the build generates:

```shell
./server/build/install/server/bin/server
```
