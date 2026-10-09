{% language-section name="mapping" %}

## Client-Side Mapping for Operations

### Mapping for Operations

As we saw in the [Client-Side MATLAB Mapping for Interfaces](../interfaces#client-side-mapping-for-interfaces), for each
[operation](./) on an interface, the generated proxy class contains 2 methods for this operation. To invoke an
operation, you call one of these methods on the proxy. For example, let’s take the generated code from the
[greeter example](../../greeter-example/defining-the-greeter-interface-in-slice):

```slice
["matlab:identifier:visitorcenter"]
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The proxy class generated from the `Greeter` interface, after removing extra details, is as follows:

```matlab
classdef GreeterPrx < Ice.ObjectPrx
    methods
        function returnValue = greet(obj, name, context)
            % ...
        end

        function future = greetAsync(obj, name, context)
            % ...
        end
    end
end
```

Given a proxy to an object of type `Greeter`, the client can invoke the `greet` operation as follows:

```matlab
greeter = visitorcenter.GreeterPrx( ...
    communicator, 'greeter:tcp -h localhost -p 4061');

greeting = greeter.greet('Alice');     % Get name via RPC
```

### Sync and Async Methods

For each operation, the Slice compiler generates 2 methods on the proxy class:

- a “sync” method with the same name as the operation. When you call this method, your program waits synchronously until
  the invocation completes. A successful invocation completes with a return value (which can be void), while an
  unsuccessful invocation completes with an exception.
- an “async” method, named `<operation-name>Async`. When you call this method, your program marshals the arguments to
  the method synchronously, but the remainder of this invocation is asynchronous, and the method returns a future
  immediately. These async methods are described in more detail in
  [Asynchronous Method Invocation (AMI) in MATLAB](#asynchronous-method-invocation-ami).

{% callout type="note" %}

Async invocations allow you to perform other work while the server is processing the request. Sync invocations are more
convenient to call. You decide what’s more important for your application.

{% /callout %}

### Exception Handling

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

Slice exceptions are thrown as MATLAB exceptions, so you can simply enclose one or more operation invocations in a
`try`-`catch` block:

```matlab
child = ...;   % Get child proxy...

try
    child.askToCleanUp();
catch ex
    if isa(ex, 'Tantrum')
        fprintf('The child says: %s\n', ex.reason);
    else
        rethrow(ex);
    end
end
```

## Asynchronous Method Invocation (AMI)

_Asynchronous Method Invocation_(AMI) is the term used to describe the client-side support for the asynchronous
programming model. AMI supports both oneway and twoway requests, but unlike their synchronous counterparts, AMI requests
never block the application. When a client issues an AMI request, the Ice runtime hands the message off to the local
transport buffer or, if the buffer is currently full, queues the request for later delivery. The application can then
continue its activities and poll or wait for completion of the invocation.

AMI is transparent to the server: there is no way for the server to tell whether a client sent a request synchronously
or asynchronously.

### Future Class

Asynchronous invocations return an instance of the `Ice.Future` class – the future object. Its API is similar to
MATLAB's [parallel.future](https://www.mathworks.com/help/matlab/ref/parallel.future.html) class, in particular, you can
call `wait` and `fetchOutputs` on this future object.

`fetchOutputs` blocks until the invocation completes. You can call `fetchOutputs` only once, including when it throws: a
second call raises an error with the identifier `Ice:InvalidStateException`. Keep the returned values if your
application needs them again.

### Asynchronous Exception Semantics

If an invocation throws an exception, the exception will be thrown when the application calls `fetchOutputs` on the
future. The exception is provided by the future, even if the actual error condition for the exception was encountered
during the call to the `Async` method ("on the way out"). The advantage of this behavior is that all exception handling
is located with the code that handles the future (instead of being present twice, once where the `Async` method is
called, and again where the future is handled).

The `Async` method throws directly, before returning a future, in the following cases:

- an argument fails validation, or the generated method fails to marshal the arguments.
- you destroyed the communicator: the `Async` method throws `Ice.CommunicatorDestroyedException`.
- you call an operation that has a return value, out-parameters or an exception specification on a oneway proxy: the
  `Async` method throws `Ice.TwowayOnlyException`.
- you call an operation with the `["oneway"]` metadata directive on a twoway proxy: the `Async` method throws
  `Ice.OnewayOnlyException`.

Handle these errors where you call the `Async` method, and the errors of the invocation where you call `fetchOutputs`.

### Asynchronous Oneway Invocations

You can invoke operations via oneway proxies asynchronously, provided the operation has `void` return type, does not
have any out-parameters, and does not throw user exceptions. If you call an asynchronous proxy method on a oneway proxy
for an operation that returns values or throws a user exception, the `Async` method throws `Ice.TwowayOnlyException`.

The future returned for a oneway invocation completes as soon as the request is successfully written to the client-side
transport. The future completes exceptionally if an error occurs before the request is successfully written.

### Flow Control

Asynchronous method invocations never block the thread that calls the `Async` function. If the local transport can
accept the request without blocking, the Ice runtime writes the request in the caller's thread. Otherwise, the Ice
runtime queues the request internally for later transmission in the background.

This creates a potential problem: if a client sends many asynchronous requests at the time the server is too busy to
keep up with them, the requests pile up in the client-side runtime until, eventually, the client runs out of memory.

You can use `future.State` to check if a request was sent and implement flow-control for your application.

### Canceling an Asynchronous Invocation

You can call `cancel` on the future returned by an async invocation to cancel this invocation. For example:

```matlab
futureGreeting = slowGreeter.greetAsync('bob');
pause(4);
futureGreeting.cancel();
```

Calling this cancel method prevents a queued invocation from being sent or, if the invocation has already been sent,
ignores a reply if the server sends one. This cancellation is purely local and has no effect on the server.

Canceling an invocation that has already completed has no effect. Otherwise, a canceled invocation is considered to be
completed, meaning the future completed with an `Ice.InvocationCanceledException`.

## Mapping for Parameters and Return Values

### In Parameters

An in parameter is mapped to a MATLAB parameter with the same name; its type is the mapped MATLAB type.

For example, a Slice parameter `string name` is mapped to a MATLAB parameter `name` with type `char` and size `(1 :)`.
The rules are the same as for [Fields](../fields).

### Out Parameters and Return Values

The MATLAB mapping uses the conventional language mechanism for returning one or more result values.

Consider the following Slice definitions:

```slice
struct NumberAndString
{
    ["matlab:identifier:X"]
    int x;

    ["matlab:identifier:Str"]
    string str;
}

sequence<string> StringSeq;

dictionary<long, StringSeq> StringTable;

interface ServerToClient
{
    void op1(out int i, out float f, out bool b, out string s);

    void op2(out NumberAndString ns,
             out StringSeq ss,
             out StringTable st);

    void op3(out ServerToClient* proxy);
}
```

The Slice compiler generates the following code:

```matlab
classdef ServerToClientPrx < Ice.ObjectPrx
    methods
        function [i, f, b, s] = op1(obj, context)
            ...
        end
        function [ns, ss, st] = op2(obj, context)
            ...
        end
        function proxy = op3(obj, context)
            ...
        end

        function future = op1Async(obj, context)
            ...
        end
        function future = op2Async(obj, context)
            ...
        end
        function future = op3Async(obj, context)
            ...
        end
    end
end
```

### Optional Parameters

[Optional parameters](./) use the same mapping as required parameters, with one difference: the parameter accepts
`Ice.Unset` as a valid value, unless it is a proxy.

Consider the following operation:

```slice
optional(1) int execute(optional(2) string p, out optional(3) float value);
```

A client can invoke this operation as shown below:

```matlab
[i, v] = proxy.execute('--file log.txt');
[i, v] = proxy.execute(Ice.Unset);

if v ~= Ice.Unset
    fprintf('value = %f\n', v); % v is set to a value
end
```

A well-behaved program must always test an optional parameter prior to using its value. Keep in mind that the
`Ice.Unset` marker value has different semantics than an empty array. Since an empty array is a legal value for certain
Slice types, the Ice runtime requires a separate marker value so that it can determine whether an optional parameter is
set. An optional parameter set to an empty array is considered to be set, unless it is a proxy.

An optional proxy parameter represents both a proxy that is not set and a null proxy with an empty array. Pass an empty
array to leave such a parameter unset, and test it with `isempty`.

{% /language-section %}
