{% language-section name="language-mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side C++ Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
[operation](../operations) on an interface, the generated proxy class contains 3 member functions for this operation. To
invoke an operation, you call one of these functions on the proxy. For example, let’s take the generated code from the
[greeter example](../defining-the-greeter-interface-in-slice):

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

```cpp
namespace VisitorCenter
{
    class GreeterPrx : public Ice::Proxy<GreeterPrx, Ice::ObjectPrx>
    {
    public:
        GreeterPrx(const Ice::CommunicatorPtr& communicator,
                std::string_view proxyString);

        // ...

        std::string greet(std::string_view name,
                const Ice::Context& context = Ice::noExplicitContext) const;

        std::future<std::string> greetAsync(std::string_view name,
                const Ice::Context& context = Ice::noExplicitContext) const;

        std::function<void()> greetAsync(std::string_view name,
                std::function<void(std::string)> response,
                std::function<void(std::exception_ptr)> exception = nullptr,
                std::function<void(bool)> sent = nullptr,
                const Ice::Context& context = Ice::noExplicitContext) const;

        // ...
    };
}
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
string greeting = greeter.greet("Alice");  // Get greeting via RPC
```

This code calls `greet` on the proxy class instance, which sends the request to the server, waits until the operation is
complete, and then unmarshals the return value and returns it to the caller.

Because the return value is of type `string`, it is safe to ignore the return value. For example, the following code
contains no memory leak:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
greeter.greet("Alice");  // Useless, but no leak
```

This is true for all mapped Slice types: you can safely ignore the return value of an operation, no matter what its type
— return values are always returned by value. If you ignore the return value, no memory leak occurs because the
destructor of the returned value takes care of deallocating memory as needed.

### Sync and Async Functions

For each operation, the Slice compiler generates 3 member functions on the proxy class:

- one “sync” function with the same name as the operation. When you call this function, your thread waits synchronously
  until the invocation completes. A successful invocation completes with a return value (which can be void), while an
  unsuccessful invocation completes with an exception.
- two overloaded “async” functions, named `<operation-name>Async`. When you call these functions, your thread marshals
  the arguments to the function synchronously, but the remainder of this invocation is asynchronous, and the function
  returns immediately. You get the result (return value or exception) through an `std::future` or a callback depending
  on the async overload you selected. These async functions are described in more detail in
  [Asynchronous Method Invocation (AMI) in C++](<../operations#asynchronous-method-invocation-(ami)>).

{% callout type="info" %}

Async invocations allow you to use threads more efficiently. Sync invocations are more convenient to call. You decide
what’s more important for your application.

{% /callout %}

### Exception Handling

Any operation invocation may throw [a runtime exception](../local-and-dispatch-exceptions) and, if the operation has an
exception specification, may also throw [user exceptions](../exceptions). Suppose we have the following simple
interface:

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

Slice exceptions are thrown as C++ exceptions, so you can simply enclose one or more operation invocations in a
`try-catch` block:

```cpp
ChildPrx child = ...;           // Get Child proxy...
try
{
    child.askToCleanUp();      // Give it a try...
}
catch (const Tantrum& t)
{
    cout << "The child says: " << t.reason << endl;
}
```

## Server-Side Mapping for Operations

### Default Mapping for Operations

As we saw in the [Server-Side C++ Mapping for Interfaces](../interfaces#server-side-mapping-for-interfaces), for each
[operation](../operations) on an interface, the generated skeleton class contains a pure virtual function with the same
name.

For example, let’s take the generated code from the [greeter example](../defining-the-greeter-interface-in-slice):

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

```cpp
namespace VisitorCenter
{
    class Greeter : public virtual Ice::Object
    {
    public:
        virtual std::string greet(std::string name,
                const Ice::Current& current) = 0;
    };
}
```

The `greet` function takes a `string name` and a `Current`, then returns a value of type `std::string`. This function
should be implemented in your derived servant class with something like:

```cpp
class Chatbot : public VisitorCenter::Greeter
{
public:
    std::string greet(std::string name, const Ice::Current&) override
    {
        ostringstream os;
        os << "Hello, " << name << "!";
        return os.str();
    }
};
```

### AMD Mapping for Operations

Each operation with the `["amd"]` metadata is mapped to a pure virtual function with an `Async` suffix in the skeleton
class. The AMD mapping replaces the default “sync” mapping for the operation. See
[Asynchronous Method Dispatch (AMD) in C++](#amd-mapping-for-operations) for details.

### Throwing Exceptions

To throw an exception from an operation implementation, you simply construct this exception and throw it. For example:

```cpp
void
MFile::write(Filesystem::Lines text, const Ice::Current&)
{
    // Try to write the file contents here...
    // Assume we are out of space...
    if (error)
    {
        throw Filesystem::WriteException{"file too large"};
    }
}
```

If you throw an arbitrary C++ exception (such as a `std::logic_error`), the Ice runtime catches the exception and then
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

### Asynchronous Exception Semantics

If an invocation throws an exception, the exception is reported by the exception callback or by the future, even if the
actual error condition for the exception was encountered during the call to the `Async` function ("on the way out"). The
advantage of this behavior is that all exception handling is located in the same place (instead of being present twice,
once where you call the `Async` function, and again where you retrieve the result) .

There are two exceptions to this rule:

- if you destroy the communicator and then make an asynchronous invocation, the `Async` function throws
  `CommunicatorDestroyedException`. This is necessary because, once the communicator is destroyed, its client thread
  pool is no longer available.
- a call to an `Async` function can throw `TwowayOnlyException`. An `Async` function throws this exception if you call
  an operation that has a return value or out-parameters on a oneway proxy.

### Asynchronous Oneway Invocations

You can invoke operations via oneway proxies asynchronously, provided the operation has `void` return type, does not
have any out-parameters, and does not throw user exceptions. If you call an `Async` function on a oneway proxy for an
operation that returns values or throws a user exception, the `Async` function throws `TwowayOnlyException`.

With the callback API, the Ice runtime does not call the response callback on a oneway or datagram proxy: a successful
invocation completes with the sent callback (see the Sent Callbacks section below). With the future-based API, the
returned future is a `future<void>`, and this future is made ready when the invocation is sent.

### Canceling an Asynchronous Invocation

The `Async` function with callback parameters returns a cancel function-object (a `std::function<void()>`). You can use
this function-object to cancel the invocation, for example:

```cpp
EmployeesPrx e = ... // get an Employees proxy
auto cancel = e.getNameAsync(
    99,
    [](string name) { cout << "Employee name is: " << name << endl; });

cancel(); // no longer interested in this name
```

Calling this cancel function-object prevents a queued invocation from being sent or, if the invocation has already been
sent, ignores a reply if the server sends one. This cancellation is purely local and has no effect on the server.

Canceling an invocation that has already completed has no effect. Otherwise, a canceled invocation is considered to be
completed, meaning the exception callback (if provided) receives an `Ice::InvocationCanceledException`.

### Polling for Completion

The future-based `Async` function allow you to poll for call completion. Polling is useful in a variety of cases. As an
example, consider the following simple interface to transfer files from client to server:

```slice
interface FileTransfer
{
    void send(int offset, ByteSeq bytes);
}
```

The client repeatedly calls `send` to send a chunk of the file, indicating at which offset in the file the chunk
belongs. A naïve way to transmit a file would be along the following lines:

```cpp
FileHandle file = open(...);
FileTransferPrx ft = ...;
const int chunkSize = ...;

int offset = 0;
while (!file.eof())
{
    ByteSeq bs;
    bs = file.read(chunkSize); // Read a chunk
    ft.send(offset, bs);      // Send the chunk
    offset += bs.size();
}
```

This works, but not very well: because the client makes synchronous calls, it writes each chunk on the wire and then
waits for the server to receive the data, process it, and return a reply before writing the next chunk. This means that
both client and server spend much of their time doing nothing — the client does nothing while the server processes the
data, and the server does nothing while it waits for the client to send the next chunk.

Using asynchronous calls, we can improve on this considerably:

```cpp
FileHandle file = open(...);
FileTransferPrx ft = ...;
const int chunkSize = ...;
int offset = 0;

deque<future<void>> results;
const int numRequests = 5;

while (!file.eof())
{
    ByteSeq bs;
    bs = file.read(chunkSize);

    // Send up to numRequests + 1 chunks asynchronously.
    auto fut = ft.sendAsync(offset, bs);
    offset += bs.size();

    results.push_back(std::move(fut));

    // Once there are more than numRequests, wait for the least
    // recent one to complete.
    while (results.size() > numRequests)
    {
        results.front().get();
        results.pop_front();
    }
}

// Wait for any remaining requests to complete.
while (!results.empty())
{
    results.front().get();
    results.pop_front();
}
```

With this code, the client sends up to `numRequests + 1` chunks before it waits for the least recent one of these
requests to complete. In other words, the client sends the next request without waiting for the preceding request to
complete, up to the limit set by `numRequests`. In effect, this allows the client to "keep the pipe to the server full
of data": the client keeps sending data, so both client and server continuously do work.

Obviously, the correct chunk size and value of `numRequests` depend on the bandwidth of the network as well as the
amount of time taken by the server to process each request. However, with a little testing, you can quickly zoom in on
the point where making the requests larger or queuing more requests no longer improves performance. With this technique,
you can realize the full bandwidth of the link to within a percent or two of the theoretical bandwidth limit of a native
socket connection.

### Sent Callbacks

When you call an `Async` function, the Ice runtime attempts to write the request to the client-side transport. If the
transport can accept the request, it is sent synchronously, in the calling thread. Otherwise, the Ice runtime queues the
request internally and sends it later, in the background.

With the callback API, you can pass a sent callback — a `std::function<void(bool)>` — as an additional argument. The Ice
runtime calls this function when the request is accepted by the transport:

- When the request is accepted synchronously, the Ice runtime calls the sent callback from the thread calling the
  `Async` function, and passes `true` as argument. Note that in this case the sent callback executes _during_ the call
  to the `Async` function, before this function returns.
- When the request is accepted asynchronously, the Ice runtime calls the sent callback from an Ice thread pool thread,
  and passes `false` as argument.

This is unlike the response and exception callbacks, which the Ice runtime always calls from an Ice thread pool thread.

If you set a custom executor in `Ice::InitializationData::executor`, this executor determines the thread that executes
the response and exception callbacks, as well as the sent callback when the request is accepted asynchronously. The
executor has no effect on a sent callback executed synchronously: the Ice runtime calls it from the thread calling the
`Async` function, as described above.

For example:

```cpp
EmployeesPrx e = ...; // get an Employees proxy

e.getNameAsync(
    99,
    [](string name) { ... handle name ... },
    [](exception_ptr ex) { ... handle exception ... },
    [](bool sentSynchronously) { ... sent ... });
```

Since the `sent` callback can execute in the calling thread before the `Async` function returns, it must not attempt to
acquire a lock that this thread already holds, as this would result in a deadlock with a non-recursive mutex.

### Flow Control

Asynchronous method invocations never block the thread that calls the `Async` function: if the local transport cannot
accept the request immediately, the Ice runtime queues the request internally for later transmission in the background.

This creates a potential problem: if a client sends many asynchronous requests at the time the server is too busy to
keep up with them, the requests pile up in the client-side runtime until, eventually, the client runs out of memory.

The sent callback described in the previous section provides a way for you to implement flow control, by counting the
number of requests that are queued: if that number exceeds some threshold, the client stops invoking more operations
until some of the queued operations have drained out of the local transport.

For example:

```cpp
EmployeesPrx e = ...; // get an Employees proxy

e.getNameAsync(
    99,
    [](string name) { ... handle name ... },
    [](exception_ptr ex) { ... handle exception ... },
    [](bool) { ... increase sent counter ... });
```

## Asynchronous Method Dispatch (AMD)

The number of simultaneous synchronous requests a server is capable of supporting is determined by the number of threads
in the server's [thread pool](../threading-model). If all of the threads are busy dispatching long-running operations,
then no threads are available to process new requests and therefore clients may experience an unacceptable lack of
responsiveness.

_Asynchronous Method Dispatch (AMD)_, the server-side equivalent of
[AMI](<../operations#asynchronous-method-invocation-(ami)>), addresses this scalability issue. Using AMD, a server can
receive a request but then suspend its processing in order to release the dispatch thread as soon as possible. When
processing resumes and the results are available, the server sends a response explicitly using a callback object
provided by the Ice runtime.

AMD is transparent to the client, that is, there is no way for a client to distinguish a request that, in the server, is
processed synchronously from a request that is processed asynchronously.

In practical terms, an AMD operation typically queues the request data (i.e., the callback object and operation
arguments) for later processing by an application thread (or thread pool). In this way, the server minimizes the use of
dispatch threads and becomes capable of efficiently supporting thousands of simultaneous clients.

An alternate use case for AMD is an operation that requires further processing after completing the client's request. In
order to minimize the client's delay, the operation returns the results while still in the dispatch thread, and then
continues using the dispatch thread for additional work.

### Async Skeleton

The easiest way to use AMD in C++ is to make your servant class derive from the async skeleton class generated by the
Slice compiler. For example:

```cpp
// This servant uses AMD
class Chatbot : public VisitorCenter::AsyncGreeter
{
public:
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

With AMD, the skeleton’s pure virtual function is named `<operation-name>Async`. This function returns `void` and
accepts the operation's in-parameters, followed by two callback parameters provided by the Ice runtime.

For example, suppose we have defined the following operation:

```slice
interface Example
{
    string op(short s, out long l);
}
```

Operation `op` is mapped as follows on the async skeleton (`AsyncExample`):

```cpp
virtual void opAsync(
    std::int16_t s,
    std::function<void(std::string_view returnValue, std::int64_t l)> response,
    std::function<void(std::exception_ptr)> exception,
    const Ice::Current& current) = 0;
```

You would get the same signature on the default skeleton (`Example`) if you decorate `op` with `["amd"]`.

### AMD Exceptions

There are two processing contexts in which the logical implementation of an AMD operation may need to report an
exception: the dispatch thread (the thread that receives the request), and the response thread (the thread that sends
the response).

{% callout type="info" %}

These are not necessarily two different threads: it is legal to send the response from the dispatch thread.

{% /callout %}

The implementation of the `Async` function in your servant class can throw an exception synchronously: it’s equivalent
to calling the exception callback with this exception.

### Chaining AMI and AMD Invocations

Since the asynchronous proxy callback API and the asynchronous dispatch API are similar, it is possible to implement an
asynchronous dispatch by sending an asynchronous request to a proxy.

Continuing our example from the previous section, suppose our servant also holds a proxy to another object of the same
type:

```cpp
class ExampleServant : public AsyncExample
{
public:
    ExampleServant(ExamplePrx prx) : _other{std::move(prx)}
    {
    }

    void opAsync(
        std::int16_t s,
        std::function<void(std::string_view, std::int64_t)> response,
        std::function<void(std::exception_ptr)> exception,
        const Ice::Current&) override
    {
        // Ice-supplied AMD response and exception callbacks are passed
        // as AMI callbacks.
        _other.opAsync(s, std::move(response), std::move(exception));
    }

private:
    const ExamplePrx _other;
};
```

{% callout type="warning" title="Oneway Proxy" %}

If your AMD implementation uses a oneway proxy, remember that the AMI response callback is not called: you need to call
the AMD response from the AMI `sent` callback.

{% /callout %}

## Mapping for Parameters and Return Values

### In Parameters

An in parameter is mapped to a C++ parameter with the same name.

The type of the mapped C++ parameter depends on the Slice type and on the direction of the parameter: are you giving
this parameter to Ice for marshaling (an outgoing value), or is Ice giving you this parameter after unmarshaling it (an
incoming value)?

For incoming values, the mapped C++ type is always “by value”: Ice transfers these arguments to you, and you get full
ownership. For outgoing values, Ice only needs to “borrow” the arguments while it marshals them synchronously into the
payload of the request.

| **Slice Parameter Type**                                            | **Mapped C++ Parameter Type (Outgoing)**                        | **Mapped C++ Parameter Type (Incoming, Always by Value)** |
| ------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| `byte`, `bool`, `int`, `short`, `long`, `float`, `double`, `enum E` | By value: `std::uint8_t`, `bool`, `std::int32_t`, etc.          | `std::uint8_t`, `bool`, `std::int32_t`, etc.              |
| `string`                                                            | “view”: `std::string_view` or `std::wstring_view`               | `std::string` or `std::wstring`                           |
| `struct S`, `sequence<T> Seq`, `dictionary<K, V> Dict`              | Const reference: `const S&`                                     | `S`, `Seq`, `Dict`                                        |
| `class C`                                                           | Const reference of shared pointer: `const CPtr&`                | `CPtr` (a shared pointer by value)                        |
| `Greeter*` (a proxy)                                                | Const reference of optional: `const std::optional<GreeterPrx>&` | `std::optional<GreeterPrx>`                               |

### Out Parameters in Synchronous Functions

A Slice parameter is mapped to a parameter with the same name in synchronous proxy and skeleton functions. The type of
the mapped C++ parameter is a non-const reference.

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
    void op1(out int i, out float f, out bool b, out string s);
    void op2(out NumberAndString ns, out StringSeq ss, out StringTable st);
    void op3(out ServerToClient* proxy);
}
```

The Slice compiler generates a proxy class for this definition (we omit the async overloads):

```cpp
class ServerToClientPrx : public Ice::Proxy<ServerToClientPrx, Ice::ObjectPrx>
{
public:
    void op1(int& i, float& f, bool& b, std::string& s, const Ice::Context& = Ice::noExplicitContext);
    void op2(NumberAndString& ns, StringSeq& ss, StringTable& st, const Ice::Context& = Ice::noExplicitContext);
    void op3(std::optional<ServerToClientPrx>& proxy, const Ice::Context& = Ice::noExplicitContext);
};
```

### Return Values in Synchronous Functions

A Slice return value is mapped to a C++ return value in synchronous proxy and skeleton functions. The C++ type is
naturally returned “by value”.

### Out Parameters and Return Values in Asynchronous Functions

#### Future-Returning Proxy Functions

One of the two overloaded proxy member functions `<operation-name>Async` returns a `std::future<T>`.

When the Slice operation returns something – either through a return value or one or more out parameters – the future
holds the return value and/or out parameters, in order of declaration (the return value, if any, is first). If there is
a single return value or out parameter, the future holds the mapped C++ type. Otherwise, the future holds a
`std::tuple`.

These parameters are all mapped “by value”, like in the Incoming column of [In Parameters](../operations#in-parameters),
since you’re receiving these values from Ice.

#### Callback Proxy Functions

The other overloaded proxy member functions `<operation-name>Async` accepts a response callback function that consumes
the return value and out parameters (if any). This callback function is provided by you (the application), and is called
by Ice.

These parameters are all mapped “by value”, like in the Incoming column of [In Parameters](../operations#in-parameters),
since you’re receiving these values from Ice.

When the operation has a return value and one ore more out parameters, the return value is mapped to a parameter named
`returnValue` int the C++ response callback.

#### AMD Skeleton Functions

On the server-side, when you use AMD, the pure virtual function `<operation-name>Async` on the generated skeleton class
provides a response callback that accepts the return value and out parameters (if any). This callback function is
provided by Ice, and you (the application) call this function in your implementation of `<operation-name>Async`.

The return value and out parameters are all mapped like in the Outgoing column of
[In Parameters](../operations#in-parameters), since you’re loaning these values to Ice for marshaling.

### Optional Parameters

The mapping for [optional parameters](../operations) is the same as for required parameters, except each mapped C++ type
is enclosed in a `std::optional`.

Consider the following operation:

```slice
optional(1) int execute(optional(2) string params, out optional(3) float value);
```

The corresponding C++ proxy function is:

```cpp
// Synchronous variant
std::optional<std::int32_t> execute(std::optional<std::string_view> params, std::optional<float>& value, ...);
```

and the corresponding C++ skeleton function is:

```cpp
// Synchronous variant
virtual std::optional<std::int32_t> execute(std::optional<std::string> params, std::optional<float>& value, ...);
```

{% callout type="info" %}

An optional parameter with a proxy type is mapped to a `std::optional<InterfaceNamePrx>`, and not to a
`std::optional<std::optional<InterfaceNamePrx>>`. This is the same rule as for optional fields with proxy types.

{% /callout %}

## See Also

- [The Ice Threading Model](../threading-model)
- [User Exceptions](../exceptions)

{% /language-section %}
