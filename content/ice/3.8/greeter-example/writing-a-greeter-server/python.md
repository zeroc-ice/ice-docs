---
title: Writing a Greeter Server
---

This page provides a step-by-step guide to writing the server-side of our Python Greeter application.

This simple server application is divided into two sections:

1. **Greeter Implementation**: First we need to create a class that “implements” the `Greeter` interface we defined
   earlier in Slice. An instance of this class is called a [servant](../../basics/terminology).
2. **Main Server Program**: Next, we instantiate this class and register the servant with the Ice runtime through an
   object adapter.

You can find the complete source code for this example in the
[ice-demos](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Ice/greeter) repository on GitHub.

## Greeter Implementation

### Compile Slice File with Slice Compiler

The first step when writing a Python application with Ice is to compile its Slice definitions using the Slice to Python
compiler (`slice2py`).

The demo is a [uv](https://docs.astral.sh/uv/) project. uv is a Python package and project manager: the demo’s
`pyproject.toml` declares a dependency on the `zeroc-ice` package, which provides the Ice for Python runtime and the
`slice2py` compiler. `uv run` runs a command in the project’s virtual environment, and creates this environment and
installs the dependencies the first time you run it.

Here we compile the `Greeter.ice` Slice file we wrote earlier, from the demo’s `server` directory:

```shell
uv run slice2py ../slice/Greeter.ice
```

Without uv, you install `zeroc-ice` with `pip` in a virtual environment, then run `slice2py ../slice/Greeter.ice` and
`python main.py` in that environment.

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

{% callout type="note" %}

It is normal for servants like `Chatbot` to contain fields and other methods in addition to the needed ones from the
generated base class. Due to our application’s simplicity, we don’t here though.

{% /callout %}

## Main Server Program

Our main server code is placed in its own file, `main.py` to keep it separate from the servant implementation. We start
this file by importing the following:

- `asyncio`: To write async code using `async/await` syntax.
- `sys`: For accessing command line arguments
- `chatbot`: This contains our servant implementation.
- `Ice`: For accessing the Ice runtime.

```py
import asyncio
import sys

import chatbot
import Ice
```

Next, we define the `main` coroutine which runs the server. This application can be broken down into 4 parts:

### 1. Create a Communicator

First, we create a [Communicator](../../runtime/communicator) using its constructor:

```py
async def main():
    loop = asyncio.get_running_loop()
    async with Ice.Communicator(sys.argv, eventLoop=loop) as communicator:
```

The communicator is our main entry point into the Ice runtime. In this simple server application, we need this
communicator to create an object adapter and nothing else (see next step). By passing the running asyncio event loop to
the communicator constructor, we enable asyncio support in the communicator.

You should always ensure that `destroy` is called when you’re done with a communicator so that connections are
gracefully closed and other clean-up is performed. In an asynchronous application, the simplest way to do that is to use
the `async with` statement like we do here.

### 2. Create an Object Adapter

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

### 3. Activate the Object Adapter

At this point, our object adapter does not accept connections yet. A client attempting to connect would get a
`ConnectTimeoutException`.

We call `activate` to start accepting connections:

```py
adapter.activate()
print("Listening on port 4061...")
```

Our server is now active, waiting for connections and requests from clients, and dispatching requests for “greeter” to
our `Chatbot` servant.

### 4. Keep Running Until Ctrl+C

It’s essential to keep the server running and not fall off main prematurely.

We await `shutdownCompleted` to wait until the communicator is shut down. In this server, this never happens: no code
shuts down the communicator. When the user presses `Ctrl+C`, `asyncio.run` cancels the `main` task, and the await raises
`asyncio.CancelledError`:

```py
try:
    await communicator.shutdownCompleted()
except asyncio.CancelledError:
    print("Caught Ctrl+C, shutting down...")
```

Once the exception handler finishes, the communicator goes out of scope and is automatically destroyed (because we used
the `async with` statement).

Finally, the script runs `main` with `asyncio.run`, which creates the event loop that `main` passes to the communicator:

```py
if __name__ == "__main__":
    asyncio.run(main())
```

## Running the Server

After compiling the Slice definitions, you run the server from the demo’s `server` directory with:

```shell
uv run main.py
```
