{% language-section name="language-mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side Java Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
[operation](./) on an interface, the generated proxy interface contains 4 methods for this operation. To invoke an
operation, you call one of these methods on the proxy. For example, let’s take the generated code from the
[greeter example](../../greeter-example/defining-the-greeter-interface-in-slice):

```slice
["java:identifier:com.example.visitorcenter"]
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The proxy interface generated from the `Greeter` interface, after removing extra details, is as follows:

```java
package com.example.visitorcenter;

public interface GreeterPrx extends com.zeroc.Ice.ObjectPrx {
    default String greet(String name) { ... }
    default String greet(String name, Map<String, String> context) { ... }

    default CompletableFuture<String> greetAsync(String name) { ... }
    default CompletableFuture<String> greetAsync(
            String name, Map<String, String> context) { ... }

    // ...

    static GreeterPrx createProxy(com.zeroc.Ice.Communicator communicator,
            String proxyString) { ... }

    // ...
}
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```java
GreeterPrx greeter = GreeterPrx.createProxy(
    communicator, "greeter:tcp -h localhost -p 4061");

String greeting = greeter.greet("Alice");  // Get name via RPC
```

### Sync and Async Methods

For each operation, the Slice compiler generates 4 methods on the proxy interface:

- two overloaded “sync” methods with the same name as the operation. When you call these methods, your thread waits
  synchronously until the invocation completes. A successful invocation completes with a return value (which can be
  void), while an unsuccessful invocation completes with an exception.
- two overloaded “async” methods, named `<operation-name>Async`. When you call these methods, your thread marshals the
  arguments to the method synchronously, but the remainder of this invocation is asynchronous, and the method returns a
  `CompletableFuture` immediately. These async methods are described in more detail in
  [Asynchronous Method Invocation (AMI) in Java](#asynchronous-method-invocation-ami).

{% callout type="note" %}

Async invocations allow you to use threads more efficiently. Sync invocations are more convenient to call. You decide
what’s more important for your application.

{% /callout %}

### Exception Handling in Java

Any operation invocation may throw a [runtime exception](../../runtime/local-and-dispatch-exceptions) and, if the
operation has an exception specification, may also throw [user exceptions](../../runtime/local-and-dispatch-exceptions).
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

Slice exceptions are thrown as Java exceptions, so you can simply enclose one or more operation invocations in a
`try`-`catch` block:

```java
ChildPrx child = ...;   // Get child proxy...

try {
    child.askToCleanUp();
} catch (Tantrum t) {
    System.out.print("The child says: ");
    System.out.println(t.reason);
}
```

## Server-Side Mapping for Operations

### Default Mapping for Operations

As we saw in the [Server-Side Java Mapping for Interfaces](../interfaces#server-side-mapping-for-interfaces), for each
[operation](./) on an interface, the generated skeleton interface contains an abstract method with the same name.

For example, let’s take the generated code from the
[greeter example](../../greeter-example/defining-the-greeter-interface-in-slice):

```slice
["java:identifier:com.example.visitorcenter"]
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The skeleton interface generated from the `Greeter` interface, after removing extra details, is as follows:

```java
package com.example.visitorcenter;

public interface Greeter extends com.zeroc.Ice.Object {
    String greet(String name, com.zeroc.Ice.Current current);

    // ...
}
```

The `greet` method takes a `String name` and a `Current`, then returns a value of type `String`. This method should be
implemented in your derived servant class with something like:

```java
class Chatbot implements Greeter {
    @Override
    public String greet(String name, Current current) {
        return "Hello, " + name + "!";
    }
}
```

### AMD Mapping for Operations

Each operation with the `["amd"]` metadata is mapped to a method with an `Async` suffix in the skeleton interface. The
AMD mapping replaces the default “sync” mapping for the operation. See
[Asynchronous Method Dispatch (AMD) in Java](#asynchronous-method-dispatch-amd) for details.

### Throwing Exceptions

To throw an exception from an operation implementation, you simply construct the exception and throw it. For example:

```java
@Override
public void write(String[] text, Current current) throws WriteException {
    // Try to write the file contents here...
    // Assume we are out of space...
    if (error) {
        throw new WriteException("file too large");
    }
}
```

Like on the client-side, the Slice exception specification maps to an exception specification on the corresponding Java
method.

If you throw an arbitrary Java exception (such as a `IllegalArgumentException`), the Ice runtime catches the exception
and then returns an `UnknownException` to the client.

If you throw an Ice runtime exception, such as `MarshalException`, the client receives an `UnknownLocalException`.

The server-side Ice runtime does not validate user exceptions thrown by an operation implementation to ensure they are
compatible with the operation's Slice definition. Rather, Ice returns the user exception to the client, where the
client-side runtime will validate the exception as usual and throws `UnknownUserException` for an unexpected exception
type.

## Asynchronous Method Invocation (AMI)

_Asynchronous Method Invocation_(AMI) is the term used to describe the client-side support for the asynchronous
programming model. AMI supports both oneway and twoway requests, but unlike their synchronous counterparts, AMI requests
never block the calling thread. When a client issues an AMI request, the Ice runtime hands the message off to the local
transport buffer or, if the buffer is currently full, queues the request for later delivery. The application can then
continue its activities and poll or wait for completion of the invocation, or receive a callback when the invocation
completes.

AMI is transparent to the server: there is no way for the server to tell whether a client sent a request synchronously
or asynchronously.

### Asynchronous Exception Semantics

If an invocation throws an exception, the exception can be obtained from the future in several ways:

- Call `get` on the future; `get` throws `CompletionException` with the actual exception available via `getCause()`
- Call `join` on the future; `join` throws `ExecutionException` with the actual exception available via `getCause()`
- Use chaining methods such as `exceptionally`, `handle` or `whenComplete` to execute custom actions

The exception is provided by the future, even if the actual error condition for the exception was encountered during the
call to the `Async` method ("on the way out"). The advantage of this behavior is that all exception handling is located
with the code that handles the future (instead of being present twice, once where the `Async` method is called, and
again where the future is handled).

There are two exceptions to this rule:

- if you destroy the communicator and then make an asynchronous invocation, the `Async` method throws
  `CommunicatorDestroyedException` directly.
- a call to an `Async` method can throw `TwowayOnlyException`. An `Async` method throws this exception if you call an
  operation that has a return value or out-parameters on a oneway proxy.

### `InvocationFuture` Class

The `CompletableFuture<T>` object that is returned by asynchronous proxy methods can be down-casted to
`InvocationFuture<T>` when an application requires more control over an invocation.

### Polling for Completion

The `InvocationFuture` methods allow you to poll for call completion. Polling is useful in a variety of cases. As an
example, consider the following simple interface to transfer files from client to server:

```slice
interface FileTransfer
{
    void send(int offset, ByteSeq bytes);
}
```

The client repeatedly calls `send` to send a chunk of the file, indicating at which offset in the file the chunk
belongs. A naïve way to transmit a file would be along the following lines:

```java
FileHandle file = open(...);
FileTransferPrx ft = ...;
int chunkSize = ...;
int offset = 0;
while (!file.eof()) {
    byte[] bs;
    bs = file.read(chunkSize); // Read a chunk
    ft.send(offset, bs);       // Send the chunk
    offset += bs.length;
}
```

This works, but not very well: because the client makes synchronous calls, it writes each chunk on the wire and then
waits for the server to receive the data, process it, and return a reply before writing the next chunk. This means that
both client and server spend much of their time doing nothing — the client does nothing while the server processes the
data, and the server does nothing while it waits for the client to send the next chunk.

Using asynchronous calls, we can improve on this considerably:

```java
FileHandle file = open(...);
FileTransferPrx ft = ...;
int chunkSize = ...;
int offset = 0;

var results = new LinkedList<InvocationFuture<Void>>();
int numRequests = 5;

while (!file.eof()) {
    byte[] bs;
    bs = file.read(chunkSize);

    // Send up to numRequests + 1 chunks asynchronously.
    CompletableFuture<Void> f = ft.sendAsync(offset, bs);
    offset += bs.length;

    // Wait until this request has been passed to the transport.
    var i = (InvocationFuture<Void>)f;
    i.waitForSent();
    results.add(i);

    // Once there are more than numRequests, wait for the least recent one to
    // complete.
    while (results.size() > numRequests) {
        i = results.getFirst();
        results.removeFirst();
        i.join();
    }
}

// Wait for any remaining requests to complete.
while (results.size() > 0) {
    InvocationFuture<Void> i = results.getFirst();
    results.removeFirst();
    i.join();
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

### Asynchronous Oneway Invocations

You can invoke operations via oneway proxies asynchronously, provided the operation has `void` return type, does not
have any out-parameters, and does not throw user exceptions. If you call an asynchronous proxy method on a oneway proxy
for an operation that returns values or throws a user exception, the `Async` method throws `TwowayOnlyException`.

The future returned for a oneway invocation completes as soon as the request is successfully written to the client-side
transport. The future completes exceptionally if an error occurs before the request is successfully written.

### Flow Control

Asynchronous method invocations never block the thread that calls the asynchronous proxy method. The Ice runtime checks
to see whether it can write the request to the local transport. If it can, it does so immediately in the caller's
thread. (In that case, `InvocationFuture.sentSynchronously` returns true.) Alternatively, if the local transport does
not have sufficient buffer space to accept the request, the Ice runtime queues the request internally for later
transmission in the background. (In that case, `InvocationFuture.sentSynchronously` returns false.)

This creates a potential problem: if a client sends many asynchronous requests at the time the server is too busy to
keep up with them, the requests pile up in the client-side run time until, eventually, the client runs out of memory.

The `InvocationFuture` class provides a way for you to implement flow control by counting the number of requests that
are queued so, if that number exceeds some threshold, the client stops invoking more operations until some of the queued
operations have drained out of the local transport:

```java
ExamplePrx proxy = ...;

CompletableFuture<Result> f = proxy.doSomethingAsync();
var i = (InvocationFuture<Result>)f;
i.whenSent((sentSynchronously, ex) -> {
    if (ex != null) {
        // handle errors...
    } else {
       // this request was sent, send another!
    }
});
```

The `whenSent` method has the following semantics:

- If the Ice runtime was able to pass the entire request to the local transport immediately, the action will be invoked
  from the current thread and the `sentSynchronously` argument will be true.
- If Ice wasn't able to write the entire request without blocking, the action will eventually be invoked from an Ice
  thread pool thread and the `sentSynchronously` argument will be false.

If you need more control over the execution environment of your action, you can use one of the `whenSentAsync` methods
instead. The `sentSynchronously` argument still behaves as described above, but your executor's implementation will
determine the threading behavior.

### Canceling an Asynchronous Invocation

`CompletableFuture` provides a `cancel` method that you can call to cancel an invocation. If the future hasn't already
completed either successfully or exceptionally, canceling the future causes it to complete with an instance of
`java.util.concurrent.CancellationException`.

Cancellation prevents a queued invocation from being sent or, if the invocation has already been sent, ignores a reply
if the server sends one. Cancellation is a local operation and has no effect on the server.

### Concurrency Semantics for AMI

When an invocation completes, the Ice runtime calls `complete` or `completeExceptionally` on the future from an Ice
thread pool thread. The thread in which your own action executes depends on the completion status of the future and the
manner in which you registered the action. Here are some examples:

- Suppose you configure an action using `whenComplete`. If the future is already complete at the time you call
  `whenComplete`, the action will execute immediately in the calling thread. If the future is not yet complete when you
  call `whenComplete`, the action will eventually execute in an Ice thread pool thread.
- Now suppose you configure an action using one of the `whenCompleteAsync` methods. Regardless of the thread in which
  Ice completes the future, your executor's implementation will determine the thread context in which the action is
  invoked. The Ice thread pool can be used as an executor; you can obtain the executor by calling the `ice_executor`
  proxy method. With the Ice thread pool executor, the action is always queued to be executed by the Ice thread pool.

## Asynchronous Method Dispatch (AMD)

The number of simultaneous synchronous requests a server is capable of supporting is determined by the number of threads
in the server's [thread pool](../../runtime/threading-model). If all of the threads are busy dispatching long-running
operations, then no threads are available to process new requests and therefore clients may experience an unacceptable
lack of responsiveness.

_Asynchronous Method Dispatch (AMD)_, the server-side equivalent of [AMI](#asynchronous-method-invocation-ami),
addresses this scalability issue. Using AMD, a server can receive a request but then suspend its processing in order to
release the dispatch thread as soon as possible. When processing resumes and the results are available, the server can
provide its results to the Ice runtime for delivery to the client.

AMD is transparent to the client, that is, there is no way for a client to distinguish a request that, in the server, is
processed synchronously from a request that is processed asynchronously.

In practical terms, an AMD operation typically queues the request data for later processing by an application thread (or
thread pool). In this way, the server minimizes the use of dispatch threads and becomes capable of efficiently
supporting thousands of simultaneous clients.

### Async Skeleton

The easiest way to use AMD in Java is to make your servant class implement the async skeleton interface generated by the
Slice compiler. For example:

```java
// This servant uses AMD
class Chatbot implements AsyncGreeter {
   // your implementation here
}
```

### Enabling AMD Piecemeal

If you prefer to implement some operations asynchronously (with AMD) and other operations synchronously, you can add the
`["amd"]` metadata directive to the operations you want to implement with AMD and use the default skeleton interface.

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

In this example, the `startProcess` of the default skeleton interface uses asynchronous dispatch while `endProcess` uses
synchronous dispatch.

### AMD Mapping

With AMD, the skeleton’s abstract method is named `<operation-name>Async`. This method returns an
`java.util.concurrent.CompletionStage<T>` and accepts the operation’s in-parameters.

The implementation of the operation, which typically returns an instance of the derived class
`java.util.concurrent.CompletableFuture<T>`, must eventually complete the future by supplying either the results or an
exception.

For example, suppose we have defined the following operation:

```slice
interface Example
{
    string op(short s, out long count);
}
```

Operation `op` is mapped as follows in the skeleton interface:

```java
public interface Example extends com.zeroc.Ice.Object {
    public static class OpResult {
        public String returnValue;
        public long count;
        ...
    }

    // synchronous dispatch methods
}

public interface AsyncExample extends com.zeroc.Ice.Object {
    CompletionStage<Example.OpResult> opAsync(
        short s, com.zeroc.Ice.Current current);
}
```

You would get the same `opAsync` method on the default skeleton (`Example`) if you decorate `op` with `["amd"]`.

### AMD Exceptions

There are two processing contexts in which the logical implementation of an AMD operation may need to report an
exception: the dispatch thread (the thread that receives the request), and the response thread (the thread that sends
the response).

{% callout type="note" %}

These are not necessarily two different threads: it is legal to send the response from the dispatch thread.

{% /callout %}

The implementation of the `Async` method in your servant class can throw an exception synchronously: it’s equivalent to
returning a future completed with this exception.

### Chaining AMI and AMD Invocations

Since the asynchronous proxy API and the asynchronous dispatch API both use `CompletionStage`, it is possible to
implement an asynchronous dispatch by sending an asynchronous request to a proxy.

Continuing our example from the previous section, suppose our servant also holds a proxy to another object of the same
type and derives its response from that of the other object:

```java
class ExampleServant implements AsyncExample {
    private final ExamplePrx _other;

    @Override
    public CompletionStage<Example.OpResult> opAsync(short s, Current current) {
        var result = _other.opAsync(s);
        // ... some other work while op is executing
        return result;
    }
}
```

## Mapping for Parameters and Return Values

### In Parameters

An in parameter is mapped to a Java parameter with the same name; its type is the mapped Java type.

For example, a Slice parameter `string name` is mapped to a Java parameter `String name`.

### Out Parameters and Return Values

The return value of a mapped method depends on how many values the corresponding Slice operation returns, including out
parameters and a non-`void` return value:

- Zero values The corresponding Java method returns `void`. For the purposes of this discussion, we're not interested in
  these operations.
- One value The corresponding Java method returns the mapped type, regardless of whether the Slice definition of the
  operation declared it as a return value or as an out parameter. Consider this example:

  ```slice
  interface I
  {
      string op1();
      void op2(out string name);
  }
  ```

  The mapping generates corresponding methods with identical signatures:

  ```java
  interface IPrx extends ObjectPrx {
      String op1();
      String op2();
  }
  ```

- Two or more values The Slice compiler generates an extra nested class to hold the results of an operation that returns
  multiple values. The class is nested in the mapped interface (not the proxy interface) and has the name `OpResult`,
  where `Op` represents the name of the operation. The leading character of the class name for a "result class" is
  always capitalized. The values of out parameters are provided in corresponding public fields of the same names. If the
  operation declares a return value, its value is provided in the field named `returnValue`.The result class defines an
  empty constructor as well as a primary constructor that accepts and assigns a value for each of its fields. The
  corresponding Java method returns the result class type.

Consider this example:

```slice
interface Example
{
    double op(int inp1, string inp2, out bool outp1, out long outp2);
}
```

The generated code looks like this:

```java
// Server-side skeleton
public interface Example extends com.zeroc.Ice.Object {
    public static class OpResult {
        public double returnValue;
        public boolean outp1;
        public long outp2;

        ...
    }

   Example.OpResult op(int inp1, String inp2, com.zeroc.Ice.Current current);
    ...
}

// Client-side proxy
public interface ExamplePrx extends com.zeroc.Ice.ObjectPrx {
    default Example.OpResult op(int inp1, String inp2) {
      ...
    }

    default Example.OpResult op(
        int inp1, String inp2, java.util.Map<String, String> context) {
        ...
    }

    default CompletableFuture<Example.OpResult> opAsync(int inp1, String inp2) {
        ...
    }

    default CompletableFuture<Example.OpResult> opAsync(
        int inp1, String inp2, java.util.Map<String, String> context) {
        ...
    }
}
```

### Null Parameters

Some Slice types naturally have "empty" or "not there" semantics. Specifically, sequences, dictionaries, and strings all
can be `null`, but the corresponding Slice types do not have the concept of a null value. To make life with these types
easier, whenever you pass `null` as a parameter or return value of type sequence, dictionary, or string, the Ice run
time automatically sends an empty sequence, dictionary, or string to the receiver.

This behavior is useful as a convenience feature: especially for deeply-nested data types, fields that are sequences,
dictionaries, or strings automatically arrive as an empty value at the receiving end. This saves you having to
explicitly initialize, for example, every string element in a large sequence before sending the sequence in order to
avoid `NullPointerException`. Note that using null parameters in this way does _not_ create null semantics for Slice
sequences, dictionaries, or strings. As far as the object model is concerned, these do not exist (only _empty_
sequences, dictionaries, and strings do). For example, whether you send a string as `null` or as an empty string makes
no difference to the receiver: either way, the receiver sees an empty string.

### Optional Parameters

The mapping uses standard Java types to encapsulate [optional parameters](./):

- `java.util.OptionalDouble` The mapped type for an optional `double`.
- `java.util.OptionalInt` The mapped type for an optional `int`.
- `java.util.OptionalLong` The mapped type for an optional `long`.
- `java.util.Optional<T>` The mapped type for all other Slice types.

Optional return values and output parameters are mapped to instances of the above classes, depending on their types. For
operations with optional in parameters, the proxy provides a set of overloaded methods that accept them as optional
values, and another set of methods that accept them as required values. Consider the following operation:

```slice
optional(1) int execute(optional(2) string parameters);
```

The mapping for this operation is shown below:

```java
// With String in-parameter
java.util.OptionalInt execute(String parameters);
java.util.OptionalInt execute(
    String parameters, java.util.Map<String, String> context);

// With Optional<String> in-parameter
java.util.OptionalInt execute(java.util.Optional<String> parameters);
java.util.OptionalInt execute(
    java.util.Optional<String> parameters, java.util.Map<String, String> context);

// Async with String in-parameter
CompletableFuture<java.util.OptionalInt> executeAsync(String parameters);
CompletableFuture<java.util.OptionalInt> executeAsync(
    String parameters, java.util.Map<String, String> context);

// Async with Optional<String> in-parameter
CompletableFuture<java.util.OptionalInt> executeAsync(
    java.util.Optional<String> parameters);
CompletableFuture<java.util.OptionalInt> executeAsync(
    java.util.Optional<String> parameters, java.util.Map<String, String> context);
```

For cases where you are passing values for all of the optional in parameters, it is more efficient to use the required
mapping and avoid creating temporary optional values.

A client can invoke `execute` as shown below:

```java
java.util.OptionalInt i;

i = proxy.execute("--file log.txt");                        // required mapping
i = proxy.execute(java.util.Optional.of("--file log.txt")); // optional mapping
i = proxy.execute(java.util.Optional.empty());              // params is unset

if (i.isPresent()) {
    System.out.println("value = " + i.getAsInt());
}
```

Passing `null` where an optional value is expected is equivalent to passing an instance whose value is unset.

{% callout type="note" %}

Java's optional classes do not consider `null` to be a legal value. Consider this example:

```slice
interface Widget
{
    ...
}

interface Repository
{
    void addOptional(optional(1) Widget* widget);
    void addRequired(Widget* widget);
}
```

The Ice encoding supports `null` proxies, so you can pass `null` to `addRequired` and the server will receive it as
`null`. However, there's no way to pass an "optional proxy set to null" in the Java mapping. Passing `null` to
`addOptional` is equivalent to passing the value of `java.util.Optional.ofNullable((T)null)`, which is equivalent to
passing the value of `java.util.Optional.empty()`. In either case, the server will receive it as an optional whose value
is not present.

{% /callout %}

## See Also

- [The Ice Threading Model](../../runtime/threading-model)

{% /language-section %}
