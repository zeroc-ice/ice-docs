{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

### Proxy Interfaces

On the client side, a Slice interface maps to a Java interface with methods that correspond to the operations on that
interface. Consider the following Slice interface:

```slice
interface Simple
{
    void op();
}
```

The Slice compiler generates the following definition for use by the client:

```java
public interface SimplePrx extends com.zeroc.Ice.ObjectPrx {
    void op();
    void op(java.util.Map<String, String> context);

    java.util.concurrent.CompletableFuture<Void> opAsync();

    java.util.concurrent.CompletableFuture<Void> opAsync(
        java.util.Map<String, String> context);
}
```

As you can see, the compiler generates a _proxy interface_ `SimplePrx`. In general, the generated name is
`<interface-name>Prx`.

In the client's address space, an instance of `SimplePrx` is the local ambassador for a remote instance of an Ice object
that implements `Simple` and is known as a proxy instance. All the details about the server-side object, such as its
address, what protocol to use, and its object identity are encapsulated in that instance.

### Creating a Proxy

The generated proxy interface provides a static `createProxy` method. With our previous example:

```java
public interface SimplePrx extends com.zeroc.Ice.ObjectPrx {
    static SimplePrx createProxy(
        com.zeroc.Ice.Communicator communicator, String proxyString)
    ...
}
```

Use `createProxy` to create a proxy from a communicator and a “stringified” proxy:

```java
SimplerPrx simple = SimplePrx.createProxy(
    communicator, "simple:tcp -h localhost -p 4061");
```

### Inheritance from `com.zeroc.Ice.ObjectPrx`

All generated proxy interfaces inherit directly or indirectly from the `com.zeroc.Ice.ObjectPrx` interface, reflecting
the fact that all Slice interfaces implicitly inherit from `Object`.

### Interface Inheritance

Inheritance relationships among Slice interfaces are maintained in the generated Java interfaces. For example:

```slice
interface A { ... }
interface B { ... }
interface C extends A, B { ... }
```

The generated code for `CPrx` reflects the inheritance hierarchy:

```java
public interface CPrx extends APrx, BPrx {
    ...
}
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

### Casting a Proxy

In addition to `createProxy`, the generated proxy interfaces provides two static methods for converting a proxy into a
proxy of another type:

```java
public interface SimplePrx extends com.zeroc.Ice.ObjectPrx {
    static SimplePrx uncheckedCast(com.zeroc.Ice.ObjectPrx obj)

    static SimplePrx checkedCast(com.zeroc.Ice.ObjectPrx obj)
}
```

#### uncheckedCast

The helper’s `uncheckedCast` static method allows you to convert any proxy into a proxy of this type. For example:

```java
// Convert a SimplePrx into a WidgetPrx, even though the two types are unrelated.
WidgetPrx widget = WidgetPrx.uncheckedCast(simple);
```

`uncheckedCast` is a local operation that always succeeds.

#### checkedCast

`checkedCast` is a conditional cast of the proxy: this method makes a remote call to the target object to check if this
object implements the proxy’s Slice interface. For example:

```java
// Call operation ice_isA on the Ice object to check if it implements Slice interface
// Widget.
WidgetPrx widget = WidgetPrx.checkedCast(simple);
```

If the target object implements the Slice interface, `checkedCast` returns a non-null proxy, just like `uncheckedCast`.
If the target object doesn’t implement this interface, `checkedCast` returns null. `checkedCast` can also throw an
exception, for example if it cannot reach the remote object.

While `checkedCast` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in practice
you know or should know the type of your proxies and calling `checkedCast` is rarely necessary.

### Proxy Factory Methods

The base proxy interface `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```java
GreeterPrx greeter = GreeterPrx.createProxy(...);

// Create a new GreeterPrx and assign it to greeter.
greeter = greeter.ice_invocationTimeout(10000);
```

The factory methods usually return a proxy of the same type as the current proxy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these methods may produce
a proxy for an object of an unrelated type, and you need to cast the returned proxy. For example:

```java
GreeterPrx greeter = GreeterPrx.createProxy(...);
GreeterAdminPrx greeterAdmin = GreeterAdminPrx.uncheckedCast(
    greeter.ice_facet("admin"));
```

## Server-Side Mapping for Interfaces

### Skeleton Interfaces

On the server side, interfaces map to _skeleton_ interfaces. A skeleton is an interface that defines a method for each
operation on the corresponding Slice interface. For example, consider our Slice definition for the `Greeter` interface:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The Slice compiler generates the following definition for this interface:

```java
package VisitorCenter;

public interface Greeter extends com.zeroc.Ice.Object {
    String greet(String name, com.zeroc.Ice.Current current);

    @Override
    default CompletionStage<com.zeroc.Ice.OutgoingResponse> dispatch(
        com.zeroc.Ice.IncomingRequest request)
        throws com.zeroc.Ice.UserException {
        ...
    }
}

public interface AsyncGreeter extends com.zeroc.Ice.Object {
    CompletionStage<String> greetAsync(
        String name, com.zeroc.Ice.Current current);

    @Override
    default CompletionStage<com.zeroc.Ice.OutgoingResponse> dispatch(
        com.zeroc.Ice.IncomingRequest request)
        throws com.zeroc.Ice.UserException {
        ...
    }
}
```

The important points to note here are:

- As for the client side, Slice modules are mapped to Java packages with the same name, so the generated skeleton
  interface is part of the `VisitorCenter` package unless you remap it with the `java:identifier` metadata directive.

- For each Slice interface `<interface-name>`, the compiler generates two Java interfaces that extend
  `com.zeroc.Ice.Object` (the skeleton interfaces).
- Each skeleton interface contains an abstract method for each operation in the Slice interface.
- Each skeleton interface reimplements (overrides) the `dispatch` method provided by `com.zeroc.Ice.Object`: it
  dispatches incoming requests to the methods on the skeleton based on the operation name received in the request.

### `Object` Servant Base Interface

The Slice pseudo-interface `Object` is mapped to the `com.zeroc.Ice.Object` interface in Java:

```java
package com.zeroc.Ice;

public interface Object {
    default CompletionStage<OutgoingResponse> dispatch(IncomingRequest request)
        throws UserException {
        ...
    }
}
```

`com.zeroc.Ice.Object` provides a default `dispatch` implementation for the 4 operations on the Slice pseudo-interface
`Object`: `ice_ping`, `ice_isA`, `ice_id` and `ice_ids`.

### Servant Classes

In order to provide an implementation for an Ice object, you must create a servant class that implements one of the
generated skeleton interfaces. For example, to create a servant for the `Greeter` interface, you could write:

```java
class Chatbot implements Greeter {
    @Override
    public String greet(String name, com.zeroc.Ice.Current current) {
        return "Hello, " + _name + "!";
    }
}
```

Note that `Chatbot` implements `VisitorCenter.Greeter`, one of the two skeleton interfaces.

As far as Ice is concerned, the `Chatbot` class must implement only a single method: the abstract method `greet`. This
makes the servant class a concrete class that you can instantiate. You can add other methods and fields as you see fit
to support your implementation.

The async skeleton interface is described in
[Asynchronous Method Dispatch (AMD) in Java](../operations#asynchronous-method-dispatch-amd).

{% /language-section %}
