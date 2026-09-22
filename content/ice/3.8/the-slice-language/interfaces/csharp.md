---
id: interfaces
language: csharp
---

{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

# Proxy Interfaces

On the client side, a Slice interface maps to a C# interface with methods that correspond to the operations on that
interface. Consider the following Slice interface:

```slice
interface Simple
{
    ["cs:identifier:Op"]
    void op();
}
```

The Slice compiler generates the following definition for use by the client:

```csharp
public partial interface SimplePrx : Ice.ObjectPrx
{
    Task OpAsync(
        Dictionary<string, string>? context = null,
        Progress<bool>? progress = null,
        CancellationToken cancel = default);

    // Synchronous "overload" provided for backwards compatibility.
    void Op(Dictionary<string, string>? context = null);
}
```

As you can see, the compiler generates a _proxy interface_`SimplePrx`. In general, the generated name is
`<interface-name>Prx`. If an interface is nested in a module `M`, the generated interface is part of namespace `M`, so
the fully-qualified name is `M.<interface-name>Prx`.

In the client's address space, an instance of `SimplePrx` is the local ambassador for a remote instance of an Ice object
that implements `Simple` and is known as a _proxy instance_. All the details about the server-side object, such as its
address, what protocol to use, and its object identity are encapsulated in that instance.

# Creating a Proxy

For each Slice interface, apart from the proxy interface, the Slice-to-C# compiler creates a helper class: for an
interface `Simple`, the name of the generated helper class is `SimplePrxHelper`.

This helper class provides the `createProxy` method. With our previous example:

```csharp
public class SimplePrxHelper : ...
{
    public static SimplePrx createProxy(
        Ice.Communicator communicator,
        string proxyString) { ... }
}
```

Use `createProxy` to create a proxy from a communicator and a “stringified” proxy:

```csharp
SimplerPrx simple = SimplePrxHelper.createProxy(
    communicator, "simple:tcp -h localhost -p 4061");
```

# Inheritance from `Ice.ObjectPrx`

All generated proxy interfaces inherit directly or indirectly from the `Ice.ObjectPrx` interface, reflecting the fact
that all Slice interfaces implicitly inherit from `Object`.

# Interface Inheritance

Inheritance relationships among Slice interfaces are maintained in the generated C# classes. For example:

```slice
module M
{
    interface A { ... }
    interface B { ... }
    interface C extends A, B { ... }
}
```

The generated code for `CPrx` reflects the inheritance hierarchy:

```csharp
namespace M;

public interface CPrx : APrx, BPrx
{
...
}
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

# Casting a Proxy

In addition to `createProxy`, the generated helper class provides two static methods for converting a proxy into a proxy
of another type:

```csharp
public class SimplePrxHelper : ...
{
    public static SimplePrx? uncheckedCast(Ice.ObjectPrx? proxy)

    public static async Task<SimplePrx?> checkedCastAsync(
        Ice.ObjectPrx proxy,
        Dictionary<string, string>? context = null
        Progress<bool>? progress = null,
        CancellationToken cancel = default)
}
```

## uncheckedCast

The helper’s `uncheckedCast` static method allows you to convert any proxy into the helper’s proxy type. For example:

```csharp
// Convert a SimplePrx into a WidgetPrx, even though the two types are unrelated.
WidgetPrx widget = WidgetPrxHelper.uncheckedCast(simple);
```

`uncheckedCast` is a local operation that always succeeds.

## checkedCastAsync

`checkedCastAsync` is a conditional cast of the proxy: this method makes a remote call to the target object to check if
this object implements the proxy’s Slice interface. For example:

```csharp
// Call operation ice_isA on the Ice object to check if it implements Slice interface
// Widget.
WidgetPrx? widget = await WidgetPrxHelper.checkedCastAsync(simple);
```

If the target object implements the Slice interface, `checkedCastAsync` returns a non-null proxy, just like
`uncheckedCast`. If the target object doesn’t implement this interface, `checkedCastAsync` returns null.
`checkedCastAsync` can also throw an exception, for example if it cannot reach the remote object.

{% callout type="info" %}

The generated proxy helper also provides a synchronous overload: `checkedCast`. We recommend you always use async
methods when making remote calls, and avoid these synchronous overloads provided for backwards compatibility.

{% /callout %}

While `checkedCastAsync` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in
practice you know or should know the type of your proxies and calling `checkedCastAsync` is rarely necessary.

# Proxy Factory Methods

The base proxy interface `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```csharp
GreeterPrx greeter = GreeterPrxHelper.createProxy(...);

// Create a new GreeterPrx and assign it to greeter.
greeter = GreeterPrxHelper.uncheckedCast(greeter.ice_invocationTimeout(10000));
```

`ice_invocationTimeout` and other factory methods in C# return an `Ice.ObjectPrx`. You need to down-cast this proxy to
the correct proxy type as shown above.

## Server-Side Mapping for Interfaces

# Skeleton Classes

On the server side, interfaces map to _skeleton_ classes. A skeleton is a class that has an abstract method for each
operation on the corresponding interface. For example, consider our Slice definition for the `Node` interface:

```slice
module VisitorCenter
{
    interface Greeter
    {
        ["cs:identifier:Greet"]
        string greet(string name);
    }
}
```

The Slice compiler generates the following definitions for this interface:

```csharp
namespace VisitorCenter
{
    public partial interface Greeter : Ice.Object
    {
        string Greet(string name, Ice.Current current);
    }

    public abstract partial class GreeterDisp_ : Greeter
    {
        public abstract string Greet(string name, Ice.Current current);

        public ValueTask<Ice.OutgoingResponse> dispatchAsync(
            Ice.IncomingRequest request)
        {
            ...
        }
    }

    public partial interface AsyncGreeter : Ice.Object
    {
        Task<string> GreetAsync(string name, Ice.Current current);
    }

    public abstract partial class AsyncGreeterDisp_ : AsyncGreeter
    {
        public abstract Task<string> GreetAsync(string name, Ice.Current current);

        public ValueTask<Ice.OutgoingResponse> dispatchAsync(
            Ice.IncomingRequest request)
        {
            ...
        }
    }
}
```

The important points to note here are:

- As for the client side, Slice modules are mapped to C# namespaces with the same name, so the skeleton class
  definitions are part of the `VisitorCenter` namespace.
- For each Slice interface, the compiler generates two C# interfaces and two C# classes - the skeleton interfaces and
  classes.
- Each skeleton class contains an abstract method for each operation in the Slice interface.
- Each skeleton class implements the `dispatchAsync` method provided by `Ice.Object`: it dispatches incoming requests to
  the methods on the skeleton class based on the operation name received in the request.

# `Ice.Object` Servant Base Interface

The Slice pseudo-interface `Object` is mapped to the `Ice.Object` interface in C#:

```csharp
namespace Ice
{
    public interface Object
    {
          public ValueTask<OutgoingResponse> dispatchAsync(IncomingRequest request)
          {
              ...
          }
          ...
    }
}
```

`Ice.Object` provides a default `dispatchAsync` implementation for the 4 operations on the Slice pseudo-interface
`Object`: `ice_ping`, `ice_isA`, `ice_id` and `ice_ids`.

# Servant Classes

In order to provide an implementation for an Ice object, you must create a servant class that inherits from one of the
generated skeleton classes. For example, to create a servant for the `Greeter` interface, you could write:

```csharp
public class Chatbot : VisitorCenter.GreeterDisp_
{
    public override string Greet(string name, Ice.Current current) =>
        $"Hello, {name}!";
}
```

Note that `Chatbot` inherits from `VisitorCenter.GreeterDisp_`, one of the two skeleton classes.

As far as Ice is concerned, the `Chatbot` class must implement only a single method: the abstract method `Name` that it
inherits from the skeleton class. This makes the servant class a concrete class that you can instantiate. You can add
other methods and fields as you see fit to support your implementation.

The async skeleton class is described in
[Asynchronous Method Dispatch (AMD) in C#](../asynchronous-method-dispatch-amd-in-csharp).

{% /language-section %}
