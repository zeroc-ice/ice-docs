{% language-section name="mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side Python Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
operation on an interface, the generated proxy class contains two methods for this operation. To invoke an operation,
you call one of these methods on the proxy. For example, let’s take the generated code from the
[greeter example](../../greeter-example/defining-the-greeter-interface-in-slice):

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The proxy class generated from the `Greeter` interface, after removing extra details, is as follows:

```py
class GreeterPrx(ObjectPrx):

    def greet(self, name: str, context: dict[str, str] | None = None) -> str:
        ...

    def greetAsync(self, name: str, context: dict[str, str] | None = None) -> Awaitable[str]:
        ...
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```py
greeter = VisitorCenter.GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
greeting = await greeter.greetAsync("Alice")  # Get name via RPC
```

### Sync and Async Methods

For each operation, the Slice compiler generates two methods on the proxy class:

- a “sync” method with the same name as the operation. When you call this method, your program waits synchronously until
  the invocation completes. A successful invocation completes with a return value (which can be void), while an
  unsuccessful invocation completes with an exception.
- an “async” method, named `<operation-name>Async`. When you call this method, your program marshals the arguments to
  the method synchronously, but the remainder of this invocation is asynchronous, and the method returns a future
  immediately. These async methods are described in more detail in
  [Asynchronous Method Invocation (AMI) in Python](#asynchronous-method-invocation-ami).

{% callout type="note" %}

We recommend using asyncio and async invocations in new applications.

{% /callout %}

### Exception Handling

Any operation invocation may raise a [runtime exception](../../runtime/local-and-dispatch-exceptions) and, if the
operation has an exception specification, may also raise [user exceptions](../../runtime/local-and-dispatch-exceptions).
Suppose we have the following simple interface:

```slice
exception Tantrum
{
    string reason;
}

interface Child
{
    void askToCleanUp() throws Tantrum;
}
```

Slice exceptions are raised as Python exceptions, so you can simply enclose one or more operation invocations in a
`try-except` block:

```py
child = ...       # Get child proxy...

try:
    await child.askToCleanUpAsync()
except Tantrum as t:
    print(f"The child says: {t.reason}")
```

## Server-Side Mapping for Operations

### Default Mapping for Operations

As we saw in the [Server-Side Python Mapping for Interfaces](../interfaces#server-side-mapping-for-interfaces), for each
operation on an interface, the generated skeleton class contains an abstract method with the same name.

For example, let’s take the generated code from the
[greeter example](../../greeter-example/defining-the-greeter-interface-in-slice):

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The skeleton class generated from the `Greeter` interface, after removing extra details, is as follows:

```py
class Greeter(Object, ABC):
    @abstractmethod
    def greet(self, name: str, current: Current) -> str | Awaitable[str]:
        pass
```

The `greet` method takes a `name: str` and a `Current`, then returns a value of type `string` directly or held in an
`Awaitable`. This method should be implemented in your derived servant class with something like:

```py
class Chatbot(VisitorCenter.Greeter):
    def greet(self, name: str, current: Ice.Current) -> str:
        return f"Hello, {name}!"
```

### AMD Mapping for Operations

The `["amd"]` metadata has no effect in Python: you can implement the mapped method either synchronously (as in the
example above) or asynchronously, as discussed in
[Asynchronous Method Dispatch (AMD) in Python](#asynchronous-method-dispatch-amd).

### Raising Exceptions

To raise an exception from an operation implementation, you simply construct the exception and raise it. For example:

```py
def write(self, text: list[str], current: Ice.Current) -> None:
    # Try to write the file contents here...
    # Assume we are out of space...
    if error:
        raise Filesystem.WriteException("file too large")
```

If you raise an arbitrary Python exception (such as a `ValueError`), the Ice runtime catches the exception and then
returns an `UnknownException` to the client.

If you raise a [dispatch exception](../../runtime/local-and-dispatch-exceptions#dispatch-exceptions), such as
`ObjectNotExistException`, the client receives the same exception. If you raise any other Ice local exception, such as
`MarshalException`, the client receives an `UnknownLocalException`.

The server-side Ice runtime does not validate user exceptions raised by an operation implementation to ensure they are
compatible with the operation's Slice definition. Rather, Ice returns the user exception to the client, where the
client-side runtime will validate the exception as usual and raises `UnknownUserException` for an unexpected exception
type.

## Asynchronous Method Invocation (AMI)

_Asynchronous Method Invocation (AMI)_ is the term used to describe the client-side support for the asynchronous
programming model. AMI supports both oneway and twoway requests, but unlike their synchronous counterparts, AMI requests
never block the calling thread. When a client issues an AMI request, the Ice runtime hands the message off to the local
transport buffer or, if the buffer is currently full, queues the request for later delivery. The application can then
continue its activities and poll or wait for completion of the invocation, or receive a callback when the invocation
completes.

AMI is transparent to the server: there is no way for the server to tell whether a client sent a request synchronously
or asynchronously.

{% callout type="note" %}

We recommend using asyncio together with AMI in new Python applications.

{% /callout %}

### Asynchronous API

Consider the following Slice definition:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

`slice2py` generates the following asynchronous proxy method:

```py
def greetAsync(
  self, name: str, context: dict[str, str] | None = None) -> Awaitable[str]:
  ...
```

As you can see, the `greet` operation generates a `greetAsync` method that accepts an optional per-invocation request
context.

The greetAsync sends (or queues) an invocation of greet. This method does not block the calling thread. It returns an
awaitable object that you typically await.

### Using AMI with `asyncio`

Create the communicator with the running asyncio event loop as its `eventLoop` argument. The `Async` methods of proxies
created with this communicator then return `asyncio.Future` objects, which you await on this event loop:

```py
# On asyncio event loop thread.
async with Ice.Communicator(
  sys.argv, eventLoop=asyncio.get_running_loop()) as communicator:
    greeter = VisitorCenter.GreeterPrx(
      communicator, "greeter:tcp -h localhost -p 4061")
    # Invoke the greetAsync method and await the result in the event loop thread.
    greeting = await greeter.greetAsync(getpass.getuser())
```

### Asynchronous Exception Semantics

If an asynchronous invocation raises an exception, the exception can be obtained from the awaitable.

The exception is provided by the awaitable, even if the actual error condition for the exception was encountered during
the call to the `Async` method ("on the way out"). The advantage of this behavior is that all exception handling is
located with the code that awaits the result.

There are four exceptions to this rule:

- if you destroy the communicator and then make an asynchronous invocation, the `Async` method raises
  `CommunicatorDestroyedException` directly.
- if you use a oneway proxy to call an operation that has a return value, out-parameters, or an exception specification,
  the `Async` method raises `TwowayOnlyException` directly.
- if you use a twoway proxy to call an operation with the [`oneway`](../slice-metadata-directives#oneway) metadata, the
  `Async` method raises `OnewayOnlyException` directly.
- if an argument has the wrong type or is out of range for its Slice type, or the request context is not a dictionary of
  strings, the `Async` method raises `ValueError` directly.

When you `await` the call inside a `try` statement, the same `except` clause handles the exceptions that the `Async`
method raises directly and the exceptions that the awaitable provides.

### Awaitable Objects

`asyncio.Future`, `Ice.Future`, and future types created by a custom event loop adapter are all awaitable
objects—meaning they can be used as the target of the await keyword.

The type of awaitable object returned by Ice’s asynchronous APIs and generated asynchronous methods depends on the
configured event loop adapter:

- **Default (no event loop adapter configured)** Ice returns `Ice.Future` objects, including `Ice.InvocationFuture` for
  invocations.
- **With an asyncio event loop** Ice returns `asyncio.Future` objects when the communicator is initialized with an
  asyncio event loop.
- **With a custom event loop adapter** Ice returns custom awaitable objects provided by the application’s
  EventLoopAdapter implementation.

### Event Loop Restrictions

You can only await a future from the event loop that created it:

- `Ice.Future` and `Ice.InvocationFuture` These are tied to the Ice thread pool. You cannot normally await them from a
  regular Python thread or from within asyncio.

  Example (❌ does not work):

  ```py
  async def main():
    # The communicator is created without an eventLoop argument.
    with Ice.Communicator(sys.argv) as communicator:
      greeter = VisitorCenter.GreeterPrx(
        communicator,
        "greeter:tcp -h localhost -p 4061")
      # Fails with RuntimeError: the returned Ice.InvocationFuture
      # cannot be awaited on the asyncio event loop.
      greeting = await greeter.greetAsync(getpass.getuser())

  asyncio.run(main())
  ```

- `asyncio.Future` These belong to the communicator's asyncio event loop, as in
  [Using AMI with asyncio](#using-ami-with-asyncio).

### Custom Event Loop Adapters

To integrate Ice with an event loop framework other than asyncio, implement the `Ice.EventLoopAdapter` abstract base
class for this event loop, and set it in the `eventLoopAdapter` member of the `InitializationData` you pass to the
communicator. The adapter wraps the futures that the `Async` methods return, and runs the coroutines of
[asynchronous dispatches](#asynchronous-method-dispatch-amd).

### Asynchronous Oneway Invocations

You can invoke operations via oneway proxies asynchronously, provided the operation has `void` return type, does not
have any out-parameters, and does not raise user exceptions. If you call an asynchronous proxy method on a oneway proxy
for an operation that returns values or raises a user exception, the method raises `TwowayOnlyException`.

Oneway invocation completes as soon as the request is successfully written to the client-side transport. Exceptions are
only reported if an error occurs before the request is successfully written.

## Asynchronous Method Dispatch (AMD)

Asynchronous Method Dispatch (AMD) is the server-side equivalent of AMI. With AMD, you can process dispatches
asynchronously, allowing the server to optimize resource usage and serve more clients compared to processing all
dispatches synchronously.

In Python, however, concurrency has an additional restriction: only one Python thread can execute at a time because of
the Global Interpreter Lock (GIL). This makes it especially important to avoid synchronous blocking calls in dispatch
operations.

For example, consider the following synchronous dispatch:

```py
def greet(self, name: str, current: Ice.Current) -> str:
  return self._db.getGreet(name)
```

If _db.getGreet blocks while waiting for the database, the thread handling this dispatch cannot perform other work until
the call returns.

With AMD, you can avoid this blocking:

```py
async def greet(self, name: str, current: Ice.Current) -> str:
  return await self._db.getGreetAsync(name)
```

In this version, the thread does not remain blocked while `getGreetAsync` runs. Instead, it can execute other tasks, and
the coroutine resumes on the appropriate thread once the database result becomes available.

### AMD Mapping

Annotating operations with `["amd"]` metadata directives has no effect in the Python mapping. The mappings for
synchronous and asynchronous dispatch are nearly identical—the only difference is the return type:

- An operation has **asynchronous semantics** if it is implemented as an async method or if it returns an awaitable
  object.
- Otherwise, the operation has **synchronous semantics**.

The [parameter passing](#in-parameters) rules for in parameters are the same in both cases.

Consider the Greeter example:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The server can choose to implement the operation synchronously or asynchronously.

**Synchronous version:**

```py
def greet(self, name: str, current: Ice.Current) -> str:
  print(f"Dispatching greet request {{ name = '{name}' }}")
  return f"Hello, {name}!"
```

**Asynchronous version (coroutine):**

```py
async def greet(self, name: str, current: Ice.Current) -> str:
  await asyncio.sleep(1)
  print(f"Dispatching greet request {{ name = '{name}' }}")
  return f"Hello, {name}!"
```

### Event Loop for Dispatch

Where the coroutine of an asynchronous dispatch runs depends on how you create the communicator:

- By default, Ice runs it on the Ice thread pool, where it can await `Ice.InvocationFuture` objects.
- With an asyncio event loop, as in [Using AMI with asyncio](#using-ami-with-asyncio), Ice runs it on this event loop,
  where it can await `asyncio.Future` objects.
- With a [custom event loop adapter](#custom-event-loop-adapters), the adapter runs it.

### Chaining Asynchronous Invocations

Because **proxy invocations** return awaitables and **asynchronous dispatch methods** may also return awaitables, it’s
straightforward to chain calls—provided the operations have the **same result type** and **compatible user-exception
sets**.

Continuing with the Greeter example, the servant can delegate directly to another Greeter:

```py
def greet(self, name: str, current: Ice.Current) -> Awaitable[str]:
  return self._greeter.greetAsync(name)
```

Or, using async/await:

```py
# Coroutine implementation (AMD semantics)
async def greet(self, name: str, current: Ice.Current) -> str:
    return await self._greeter.greetAsync(name)
```

The `greet` dispatch is implemented by delegating to another Greeter server, and we directly return the result from the
nested async invocation.

## Mapping for Parameters and Return Values

### In Parameters

An in parameter maps to a Python method argument, and an invocation does not modify the arguments you pass.

Here is an interface with operations that pass parameters of various types from client to server:

```slice
struct NumberAndString
{
    int x;
    string str;
}

sequence<string> StringSeq;

dictionary<long, StringSeq> StringTable;

interface ClientToServer
{
    void op1(int i, float f, bool b, string s);
    void op2(NumberAndString ns, StringSeq ss, StringTable st);
    void op3(ClientToServer* proxy);
}
```

The Slice compiler generates the following proxy for this definition:

```py
class ClientToServerPrx(Ice.ObjectPrx):
    def op1(self, i, f, b, s, context=None):
        ...

    def op2(self, ns, ss, st, context=None):
        ...

    def op3(self, proxy, context=None):
        ...
```

Given a proxy to a `ClientToServer` interface, the client code can pass parameters as in the following example:

```py
p = ...                                 # Get proxy...

p.op1(42, 3.14, True, "Hello world!")   # Pass simple literals

i = 42
f = 3.14
b = True
s = "Hello world!"
p.op1(i, f, b, s)                       # Pass simple variables

ns = NumberAndString()
ns.x = 42
ns.str = "The Answer"
ss = [ "Hello world!" ]
st = {}
st[0] = ss
p.op2(ns, ss, st)                       # Pass complex variables

p.op3(p)                                # Pass proxy
```

### Out Parameters

As in Java, Python functions do not support reference arguments. That is, it is not possible to pass an uninitialized
variable to a Python function in order to have its value initialized by the function.

The semantics of `out` parameters in the Python mapping depend on whether the operation returns one value or multiple
values. An operation returns multiple values when it has declared multiple `out` parameters, or when it has declared a
non-`void` return type and at least one `out` parameter.

If an operation returns multiple values, the client receives them in the form of a _result tuple_. A non-`void` return
value, if any, is always the first element in the result tuple, followed by the `out` parameters in the order of
declaration.

If an operation returns only one value, the client receives the value itself.

Here again are the same Slice definitions we saw earlier, but this time with all parameters being passed in the `out`
direction:

```slice
struct NumberAndString
{
    int x;
    string str;
}

sequence<string> StringSeq;

dictionary<long, StringSeq> StringTable;

interface ServerToClient
{
    int op1(out float f, out bool b, out string s);
    void op2(out NumberAndString ns,
             out StringSeq ss,
             out StringTable st);
    void op3(out ServerToClient* proxy);
}
```

The Python mapping generates the following code for this definition:

```py
class ServerToClientPrx(Ice.ObjectPrx):
    def op1(self, context=None):
        ...

    def op2(self, context=None):
        ...

    def op3(self, context=None):
        ...
```

Given a proxy to a `ServerToClient` interface, the client code can receive the results as in the following example:

```py
p = ...              # Get proxy...
i, f, b, s = p.op1()
ns, ss, st = p.op2()
stcp = p.op3()
```

The operations have no `in` parameters, therefore no arguments are passed to the proxy methods. Since `op1` and `op2`
return multiple values, their result tuples are unpacked into separate values, whereas the return value of `op3`
requires no unpacking.

### Parameter Type Mismatches

Although the Python compiler cannot check the types of arguments passed to a function, the Ice runtime does perform
validation on the arguments to a proxy invocation and reports any type mismatches as a `ValueError` exception.

### Null Parameters

Slice strings, sequences, and dictionaries have no null value. When you pass `None` for one of these types, whether as a
parameter, a return value, a field, or a sequence element, Ice sends an empty string, sequence, or dictionary. For an
[optional](#optional-parameters-in-python) parameter, return value, or field, `None` instead leaves the value unset.

### Optional Parameters in Python

[Optional parameters](#optional-parameters-and-return-values) use the same mapping as required parameters. The only
difference is that `None` can be passed as the value of an optional parameter or return value. Consider the following
operation:

```slice
optional(1) int execute(optional(2) string params, out optional(3) float value);
```

The corresponding Python proxy method is:

```py
def execute(
    self,
    params: str | None = None,
    context: dict[str, str] | None = None) -> tuple[int | None, float | None]:
    ...

def executeAsync(
    self,
    params: str | None = None,
    context: dict[str, str] | None = None) -> Awaitable[
        tuple[int | None, float | None]]:
    ...
```

and the corresponding Python skeleton method is:

```py
@abstractmethod
def execute(
    self,
    params: str | None,
    current: Current) -> tuple[
        int | None, float | None] | Awaitable[tuple[int | None, float | None]]:
    ...
```

## See Also

- [Exceptions](../exceptions)
- [The Ice Threading Model](../../runtime/threading-model)

{% /language-section %}
