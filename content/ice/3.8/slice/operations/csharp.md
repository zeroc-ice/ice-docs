{% language-section name="language-mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side C# Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
[operation](../operations) on an interface, the generated proxy class contains two methods for this operation. To invoke
an operation, you call one of these methods on the proxy. For example, let’s take the generated code from the
[greeter example](../defining-the-greeter-interface-in-slice):

```slice
module VisitorCenter
{
    interface Greeter
    {
        ["cs:identifier:Greet"]
        string greet(string name);
    }
}
```

The proxy interface generated from the `Greeter` interface, after removing extra details, is as follows:

```csharp
namespace VisitorCenter
{
    public partial interface GreeterPrx : Ice.ObjectPrx
    {
        string Greet(
            string name,
            Dictionary<string, string>? context = null);

        Tasks.Task<string> GreetAsync(
            string name,
            Dictionary<string, string>? context = null,
            IProgress<bool>? progress = null,
            CancellationToken cancel = default);
    }
}
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```csharp
GreeterPrx greeter = GreeterPrxHelper.createProxy(
    communicator, "greeter:tcp -h localhost -p 4061");

string greeting = await greeter.GreetAsync("Alice");  // Get greeting via RPC
```

### Sync and Async Methods

For each operation, the Slice compiler generates 2 methods on the proxy class:

- a “sync” method with the same name as the operation. When you call this method, your thread waits synchronously until
  the invocation completes. A successful invocation completes with a return value (which can be void), while an
  unsuccessful invocation completes with an exception.

- an “async” method, named `<operation-name>Async`. When you call this method, your thread marshals the arguments to the
  method synchronously, but the remainder of this invocation is asynchronous, and the method returns immediately. You
  get the result (return value or exception) through a `Task`. These async methods are described in more detail in
  [Asynchronous Method Invocation (AMI) in C#](<../operations#asynchronous-method-invocation-(ami)>).

{% callout type="info" %}

The “sync” methods are provided for backwards compatibility: you should only use the async methods in modern C# code.

{% /callout %}

### Exception Handling

Any operation invocation may throw a [runtime exception](../local-and-dispatch-exceptions) and, if the operation has an
exception specification, may also throw [user exceptions](../local-and-dispatch-exceptions). Suppose we have the
following simple interface:

```slice
exception Tantrum
{
    ["cs:identifier:Reason"]
    string reason;
}

interface Child
{
    ["cs:identifier:AskToCleanUp"]
    void askToCleanUp() throws Tantrum;
}
```

Slice exceptions are thrown as C# exceptions, so you can simply enclose one or more operation invocations in a
`try`-`catch` block:

```csharp
ChildPrx child = ...;   // Get child proxy...

try
{
    await child.AskToCleanUpAsync();
}
catch (Tantrum t)
{
    Console.WriteLine($"The child says: {t.Reason}");
}
```

## Server-Side Mapping for Operations

### Default Mapping for Operations

As we saw in the [Server-Side C# Mapping for Interfaces](../interfaces#server-side-mapping-for-interfaces), for each
[operation](../operations) on an interface, the generated skeleton class contains an abstract method with the same name.

For example, let’s take the generated code from the [greeter example](../defining-the-greeter-interface-in-slice):

```slice
module VisitorCenter
{
    interface Greeter
    {
        ["cs:identifier:Greet"]
        string greet(string name);
    }
}
```

The skeleton class generated from the `Greeter` interface, after removing extra details, is as follows:

```csharp
namespace VisitorCenter
{
    public partial interface Greeter : Ice.Object
    {
        string Greet(string name, Ice.Current current);
    }

    public abstract partial class GreeterDisp_ : Greeter
    {
        public abstract string Greet(string name, Ice.Current current);
    }
}
```

The `Greet` method takes a `string name` and a `Current`, then returns a value of type `string`. This method should be
implemented in your derived servant class with something like:

```csharp
internal class Chatbot : VisitorCenter.GreeterDisp_
{
    public override string Greet(string name, Ice.Current current)
        => $"Hello, {name}!";
}
```

### AMD Mapping for Operations

Each operation with the `["amd"]` metadata is mapped to a method with an `Async` suffix in the skeleton class. The AMD
mapping replaces the default “sync” mapping for the operation. See
[Asynchronous Method Dispatch (AMD) in C#](<../operations#asynchronous-method-dispatch-(amd)>) for details.

### Throwing Exceptions

To throw an exception from an operation implementation, you simply construct the exception and throw it. For example:

```csharp
public override void Write(string[] text, Ice.Current current)
{
    // Try to write the file contents here...
    // Assume we are out of space...
    if (error)
    {
        throw new Filesystem.WriteException("file too large");
    }
}
```

If you throw an arbitrary C# exception (such as a `ArgumentException`), the Ice runtime catches the exception and then
returns an `UnknownException` to the client.

If you throw an Ice runtime exception, such as `MarshalException`, the client receives an `UnknownLocalException`.

The server-side Ice runtime does not validate user exceptions thrown by an operation implementation to ensure they are
compatible with the operation's Slice definition. Rather, Ice returns the user exception to the client, where the
client-side runtime will validate the exception as usual and throws `UnknownUserException` for an unexpected exception
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

{% callout type="info" %}

In a modern C# application, you should always use AMI. The synchronous API is provided for backwards compatibility.

{% /callout %}

### Asynchronous API

Consider the following Slice definition:

```slice
module Demo
{
    interface Employees
    {
        ["cs:identifier:GetName"]
        string getName(int number);
    }
}
```

`slice2cs` generates the following asynchronous proxy method:

```csharp
public partial interface EmployeesPrx : Ice.ObjectPrx
{
    Task<string> GetNameAsync(
        int number,
        Dictionary<string, string>? context = null,
        IProgress<bool>? progress = null,
        CancellationToken cancel = default);
    ...
}
```

As you can see, the `getName` operation generates a `GetNameAsync` method that accepts several optional parameters:

- a [per-invocation request context](../request-contexts)
- a sent callback
- a cancellation token

The `GetNameAsync` method sends (or queues) an invocation of `getName`. This method does not block the calling thread.
It returns a `Task` that you typically await. Here's an example that calls `getNameAsync`:

```csharp
EmployeesPrx e = ...;
string name = await e.GetNameAsync(99);
```

### Asynchronous Exception Semantics

If an invocation throws an exception, the exception can be obtained from the task.

The exception is provided by the task, even if the actual error condition for the exception was encountered during the
call to the `Async` method ("on the way out"). The advantage of this behavior is that all exception handling is located
with the code that handles the task (instead of being present twice, once where the `Async` method is called, and again
where the task is handled).

There are two exceptions to this rule:

- if you destroy the communicator and then make an asynchronous invocation, the `Async` method throws
  `CommunicatorDestroyedException` directly.
- a call to an `Async` method can throw `TwowayOnlyException`. An `Async` method throws this exception if you call an
  operation that has a return value or out-parameters on a oneway proxy.

{% callout type="info" %}

This behavior is provided for consistency with other Ice language mappings. In modern C#, it is preferable to report
synchronous exceptions (such as marshaling exceptions) synchronously.

{% /callout %}

### Asynchronous Oneway Invocations

You can invoke operations via oneway proxies asynchronously, provided the operation has `void` return type, does not
have any out-parameters, and does not throw user exceptions. If you call an asynchronous method on a oneway proxy for an
operation that returns values or throws a user exception, the proxy method throws `TwowayOnlyException`.

The task returned for a oneway invocation completes as soon as the request is successfully written to the client-side
transport. The task completes with an exception if an error occurs before the request is successfully written.

### Flow Control

Asynchronous method invocations never block the thread that calls the asynchronous proxy method. The Ice runtime checks
to see whether it can write the request to the local transport. If it can, it does so immediately in the caller's
thread. Alternatively, if the local transport does not have sufficient buffer space to accept the request, the Ice
runtime queues the request internally for later transmission in the background.

This creates a potential problem: if a client sends many asynchronous requests at the time the server is too busy to
keep up with them, the requests pile up in the client-side runtime until, eventually, the client runs out of memory.

The API provides a way for you to implement flow control by counting the number of requests that are queued so, if that
number exceeds some threshold, the client stops invoking more operations until some of the queued operations have
drained out of the local transport. One of the optional arguments to every asynchronous proxy invocation is a
`System.IProgress<bool>`. If you provide a delegate, the Ice runtime will eventually invoke it when the request has been
sent and provide a boolean argument indicating whether the request was sent synchronously. This argument is true if the
entire request could be transferred to the local transport in the caller's thread without blocking, otherwise the
argument is false. Furthermore, a value of true indicates that Ice is invoking your delegate recursively from the
calling thread, whereas a value of false indicates that Ice is invoking the delegate from an Ice thread pool thread.

Here's a simple example to demonstrate the flow control feature:

```csharp
ExamplePrx proxy = ...;
proxy.DoSomethingAsync(progress: (sentSynchronously) =>
{
    if (sentSynchronously)
    {
        // Entire request was accepted by the transport,
        // called recursively from this thread
    }
    else
    {
        // Request was queued but has now been sent,
        // called from a separate thread
    }
});
```

Using this feature, you can limit the number of queued requests by counting the number of requests that are queued and
decrementing the count when the Ice runtime passes a request to the local transport.

### Canceling an Asynchronous Invocation

Every asynchronous proxy method accepts an optional `CancellationToken` argument. Its default value is `default`, which
is equivalent to passing `CancellationToken.None`.

Cancellation prevents a queued invocation from being sent or, if the invocation has already been sent, ignores a reply
if the server sends one. Cancellation is a local operation and has no effect on the server. The result of a canceled
invocation is an `Ice.InvocationCanceledException`.

## Asynchronous Method Dispatch (AMD)

The number of simultaneous synchronous requests a server is capable of supporting is determined by the number of threads
in the server's [thread pool](../threading-model). If all of the threads are busy dispatching long-running operations,
then no threads are available to process new requests and therefore clients may experience an unacceptable lack of
responsiveness.

_Asynchronous Method Dispatch (AMD)_, the server-side equivalent of
[AMI](<../operations#asynchronous-method-invocation-(ami)>), addresses this scalability issue. Using AMD, a server can
receive a request but then suspend its processing in order to release the dispatch thread as soon as possible. When
processing resumes and the results are available, the server can provide its results to the Ice runtime for delivery to
the client.

AMD is transparent to the client, that is, there is no way for a client to distinguish a request that, in the server, is
processed synchronously from a request that is processed asynchronously.

In practical terms, an AMD operation typically queues the request data for later processing by an application thread (or
thread pool). In this way, the server minimizes the use of dispatch threads and becomes capable of efficiently
supporting thousands of simultaneous clients.

### Async Skeleton

The easiest way to use AMD in C# is to make your servant class derive from the async skeleton class generated by the
Slice compiler. For example:

```csharp
// This servant uses AMD
public class Chatbot : VisitorCenter.AsyncGreeter
{
   // your implementation here
};
```

### Enabling AMD Piecemeal

If you prefer to implement some operations asynchronously (with AMD) and other operations synchronously, you can add the
`["amd"]` metadata directive to the operations you want to implement with AMD and use the default skeleton class.

The metadata directive _replaces_ synchronous dispatch on the default skeleton, that is, a particular operation
implementation must use synchronous or asynchronous dispatch and cannot use both.

Consider the following Slice definitions:

```slice
interface Controller
{
    ["amd"] void startProcess();
    int endProcess();
}
```

In this example, the `startProcess` of the default skeleton class uses asynchronous dispatch while `endProcess` uses
synchronous dispatch.

### AMD Mapping

With AMD, the skeleton’s abstract method is named `<operation-name>Async`. This method returns a `Task` and accepts the
operation's in-parameters.

For example, suppose we have defined the following operation:

```slice
interface Example
{
    ["cs:identifier:Op"]
    string op(short s, out long l);
}
```

Operation `op` is mapped as follows in the async skeleton class:

```csharp
public record struct Example_OpResult(string returnValue, long l);

public abstract partial class AsyncExampleDisp_ : AsyncExample
{
    public abstract Task<Example_OpResult> OpAsync(short s, Ice.Current current);
    ...
}
```

You would get the same signature on the default skeleton (`Example`) if you decorate `op` with `["amd"]`.

### AMD Exceptions

There are two processing contexts in which the logical implementation of an AMD operation may need to report an
exception: the dispatch thread (the thread that receives the request), and the response thread (the thread that
completes the task).

{% callout type="info" %}

These are not necessarily two different threads: it is legal to complete the task from the dispatch thread.

{% /callout %}

The implementation of the `Async` method in your servant class can throw an exception synchronously: it’s equivalent to
returning a task completed with this exception.

## Mapping for Parameters and Return Values

### In Parameters

An in parameter is mapped to a C# parameter with the same name; its type is the mapped C# type.

For example, a Slice parameter `string name` is mapped to a C# parameter `string name`.

### Out Parameters in Synchronous Methods

An out parameter is mapped to an out parameter with the same name in synchronous proxy and skeleton methods; the type of
the parameter is the mapped C# type.

Consider the following example:

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
    ["cs:identifier:Op1"]
    void op1(out int i, out float f, out bool b, out string s);

    ["cs:identifier:Op2"]
    void op2(out NumberAndString ns, out StringSeq ss, out StringTable st);

    ["cs:identifier:Op3"]
    void op3(out ServerToClient* proxy);
}
```

The Slice compiler generates a proxy interface for these definitions (we omit the async overloads):

```csharp
public partial interface ServerToClientPrx : Ice.ObjectPrx
{
    void Op1(
      out int i,
      out float f,
      out bool b,
      out string s,
      Dictionary<string, string>? context = null);

    void Op2(
      out NumberAndString ns,
      out string[] ss,
      out Dictionary<long, string[]> st,
      Dictionary<string, string>? context = null);

    void Op3(
      out ServerToClientPrx? proxy,
      Dictionary<string, string>? context = null);
}
```

### Return Values in Synchronous Methods

A Slice return value is mapped to a C# return value in synchronous proxy and skeleton methods.

### Out Parameters and Return Values in Asynchronous Methods

Out parameters and return values are mapped to C# `Task` return values.

The returned Task depends on how many values an operation returns, including out parameters and a non-`void` return
value:

- Zero values The corresponding C# method returns a plain `Task`.
- One value The corresponding C# method returns a `Task<T>`, where T is the mapped C# type.
- Two or more values The corresponding C# method returns a `Task<Interface_OpResult>`, where `Interface_OpResult` is a
  generated record struct that holds the return value and out parameters.

Consider this example:

```slice
interface Example
{
    ["cs:identifier:Op"]
    double op(int inp1, string inp2, out bool outp1, out long outp2);
}
```

The Slice compiler generates the following C# code for this interface:

```csharp
public record struct Example_OpResult(double returnValue, bool outp1, long outp2);

public partial interface ExamplePrx : Ice.ObjectPrx
{
    Task<Example_OpResult> OpAsync(
        int inp1,
        string inp2,
        Dictionary<string, string>? context = null,
        ...);
}
```

### Optional Parameters

The mapping for [optional parameters](../operations) is the same as for required parameters, except each mapped C# type
is nullable, where null represents “not set”.

Consider the following operation:

```slice
["cs:identifier:Execute"]
optional(1) int execute(optional(2) string parameters, out optional(3) float value);
```

The corresponding C# proxy method is:

```csharp
// Asynchronous variant
Task<Example_ExecuteResult> ExecuteAsync(
    string? parameters,
    Dictionary<string, string>? context = null, ...);
```

and the corresponding C# skeleton method is:

```csharp
// Synchronous variant
int? Execute(string? parameters, out float? value, Ice.Current current);
```

## See Also

- [The Ice Threading Model](../threading-model)

{% /language-section %}
