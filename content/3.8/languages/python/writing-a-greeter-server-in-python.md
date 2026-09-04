---
id: writing-a-greeter-server-in-python
title: Writing a Greeter Server in Python
---

This page provides a step-by-step guide to writing the server-side of our Python Greeter application.

This simple server application is divided into two sections:

1. **Greeter Implementation**: First we need to create a class that “implements” the `Greeter` interface we defined
   earlier in Slice. An instance of this class is called a [servant](../terminology).
2. **Main Server Program**: Next, we instantiate this class and register the servant with the Ice runtime through an
   object adapter.

You can find the complete source code for this example in the
[ice-demos](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Ice/greeter) repository on GitHub.

## Greeter Implementation

### Compile Slice File with Slice Compiler

The first step when writing a Python application with Ice is to compile its Slice definitions using the Slice to Python
compiler (`slice2py`).

Here we compile the `Greeter.ice` Slice file we wrote earlier.

This compilation generates a Python package named `VisitorCenter`, which matches the Slice module name. Inside this
package, you’ll find the generated `Greeter` module corresponding to the `Greeter` interface defined in Slice. This
module defines the `Greeter` abstract base class we implement in the code below.

### Implement Servant Class

An abstract base class is generated for each Slice interface. The package and class of this abstract base class matches
the Slice module and interface name—for this example, `VisitorCenter.Greeter`.

We implement this abstract base class with a Python class, `Chatbot`, declared in `chatbot.py`:

```py
import Ice
import VisitorCenter


class Chatbot(VisitorCenter.Greeter):

    def greet(self, name: str, current: Ice.Current) -> str:
        print(f"Dispatching greet request {{ name = '{name}' }}")
        return f"Hello, {name}!"
```

Since the `Greeter` Slice interface only has one operation (`greet`), there is only one function that `Chatbot` needs to
implement.

You can see it takes a `name` parameter, and returns a greeting based on the provided `name`, matching both the
generated abstract class, and indirectly, what was specified in our Slice file.

{% callout type="info" %}

It is normal for servants like `Chatbot` to contain fields and other methods in addition to the needed ones from the
generated base class. Due to our application’s simplicity, we don’t here though.

{% /callout %}

## Main Server Program

Our main server code is placed in its own file, `main.py` to keep it separate from the servant implementation. We start
this file by importing the following:

- `sys`: For accessing command line arguments
- `chatbot`: This contains our servant implementation.
- `Ice`: For accessing the Ice runtime.

```py
import sys
import chatbot
import Ice
```

Next, we define the `main` function which runs the server. This application can be broken down into 4 parts:

### Create a Communicator

First, we create a [Communicator](../communicator) using its constructor:

```py
with Ice.Communicator(sys.argv) as communicator:
```

The communicator is our main entry point into the Ice runtime. In this simple server application, we need this
communicator to create an object adapter and nothing else (see next step).

You should always ensure that `destroy` is called when you’re done with a communicator so that connections are
gracefully closed and other clean-up is performed. The simplest way to do that is to use the `with` statement like we do
here.

### Create an Object Adapter

Next, we create an object adapter using our communicator:

```py
adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061")
```

An object adapter serves two purposes in Ice:

- it accepts connections from clients
- it receives requests over these connections and routes them to servants based on the object identities carried by
  these requests

In this example, we create an object adapter named `GreeterAdapter` which listens for TCP connections on port 4061, and
later receives requests over these connections.

```py
adapter.add(chatbot.Chatbot(), Ice.Identity(name="greeter"))
```

Later on, when the object adapter receives a request with identity “greeter”, it will route this request to our
`Chatbot` instance. It is therefore essential that the client uses the same identity in its proxy.

### Activate the Object Adapter

At this point, our object adapter does not accept connections yet. A client attempting to connect would get a
`ConnectTimeoutException`.

We call `activate` to start accepting connections:

```py
adapter.activate();
print("Listening on port 4061...")
```

Our server is now active, waiting for connections and requests from clients, and dispatching requests for “greeter” to
our `Chatbot` servant.

### Keep Running until Ctrl+C

It’s essential to keep the server running and not fall off main prematurely.

We use `waitForShutdown` to wait until the communicator is shut down. In this server, this never happens - no code shuts
down the communication. The call only returns when the user hits `Ctrl+C` which raises `KeyboardInterrupt` exception:

```py
try:
    communicator.waitForShutdown()
except KeyboardInterrupt:
    print("Caught Ctrl+C, exiting...")
```

{% callout type="info" %}

The main thread is just waiting in this call - it does not perform any work.

{% /callout %}

Once the exception handler finishes, the communicator goes out of scope and is automatically destroyed (because we used
the with statement). At that point, the application exits cleanly.

## Running the Server

After building the server (see the demo’s
[README](https://github.com/zeroc-ice/ice-demos/blob/3.8/python/Ice/greeter/README.md) for instructions), you can run it
with:

```
python main.py
```
