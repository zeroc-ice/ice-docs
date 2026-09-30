{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

### Proxy Protocols

On the client side, a Slice interface maps to an empty Swift protocol. A public extension of this protocol provides two
methods for each Slice operation of your Slice interface.

Consider the following Slice interface:

```slice
module M
{
    interface Simple
    {
        void op();
    }
}
```

The Slice compiler generates the following definitions for use by the client:

```swift
// in module M

public protocol SimplePrx: Ice.ObjectPrx {}

public extension SimplePrx {
    func op(context: Ice.Context? = nil) async throws {
        ...
    }
}
```

As you can see, the compiler generates a _proxy protocol_ `SimplePrx`. In general, the generated name is
`<interface-name>Prx`.

In the client's address space, an instance of `SimplePrx` is the local ambassador for a remote instance of an Ice object
that implements `Simple` and is known as a proxy instance. All the details about the server-side object, such as its
address, what protocol to use, and its object identity are encapsulated in that instance.

### Creating a Proxy

For each proxy, the Slice compiler generate a `makeProxy` factory function in the same Swift module. With our previous
example:

```swift
public protocol SimplePrx: Ice.ObjectPrx {}

public func makeProxy(communicator: Ice.Communicator,
                      proxyString: String,
                      type: SimplePrx.Protocol) throws -> SimplePrx {
    ...
}
```

Call `makeProxy` to create a proxy from a communicator and a “stringified” proxy:

```swift
let simple = try makeProxy(
    communicator: communicator, proxyString: "simple:tcp -h localhost -p 4061",
    type: SimplePrx.self)
```

### Inheritance from `Ice.ObjectPrx`

All generated proxy protocols inherit directly or indirectly from the `Ice.ObjectPrx` protocol, reflecting the fact that
all Slice interfaces implicitly inherit from `Object`.

### Interface Inheritance

Inheritance relationships among Slice interfaces are maintained in the generated Swift protocols. For example:

```slice
module M
{
    interface A { ... }
    interface B { ... }
    interface C extends A, B { ... }
}
```

The generated code for `CPrx` reflects the inheritance hierarchy:

```swift
public protocol CPrx: APrx, BPrx {}
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

### Casting Proxy

For each proxy, the Slice compiler generate 2 helper functions that allow you to convert any proxy into a proxy of this
type. With our Simple example:

```swift
public protocol SimplePrx: Ice.ObjectPrx {}

public func uncheckedCast(prx: Ice.ObjectPrx,
                          type: SimplePrx.Protocol,
                          facet: String? = nil) -> SimplePrx {
    ...
}

public func checkedCast(prx: Ice.ObjectPrx,
                        type: SimplePrx.Protocol,
                        facet: String? = nil,
                        context: Ice.Context? = nil) async throws -> SimplePrx? {
    ...
}
```

#### uncheckedCast

The `uncheckedCast` function allows you to convert a proxy into another proxy. For example:

```swift
// Convert a SimplePrx into a WidgetPrx, even though the two types are unrelated.
let widget = uncheckedCast(prx: simple, type: WidgetPrx.self)
```

`uncheckedCast` is a local operation that always succeeds.

#### checkedCast

`checkedCast` is a conditional cast of the proxy: this function makes a remote call to the target object to check if
this object implements the proxy’s Slice interface. For example:

```swift
// Call operation ice_isA on the Ice object to check if it implements Slice interface
// Widget.
let widget = try await checkedCast(prx: simple, type: WidgetPrx.self)
```

If the target object implements the Slice interface, `checkedCast` returns a non-nil proxy, just like `uncheckedCast`.
If the target object doesn’t implement this interface, `checkedCast` returns nil. `checkedCast` can also throw an
exception, for example if it cannot reach the remote object.

While `checkedCast` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in practice
you know or should know the type of your proxies and calling `checkedCast` is rarely necessary.

### Proxy Factory Methods

The base proxy interface `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```swift
var greeter = try makeProxy(communicator: ..., proxyString: ..., type: GreeterPrx.self)

// Create a new GreeterPrx and assign it to greeter.
greeter = greeter.ice_invocationTimeout(10000)
```

The factory methods usually return a proxy of the same type as the current proxy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these methods may produce
a proxy for an object of an unrelated type, and you need to cast the returned proxy. For example:

```swift
let greeter = try makeProxy(communicator: ..., proxyString: ..., type: GreeterPrx.self)
let greeterAdmin = uncheckedCast(
    prx: greeter.ice_facet("admin"), type: GreeterAdminPrx.self)
```

## Server-Side Mapping for Interfaces

The server-side mapping for interfaces provides an up-call API for the Ice runtime: by implementing instance methods in
a servant class, you provide the hook that gets the thread of control from the Ice server-side runtime into your
application code.

### Skeleton Protocols

On the server side, interfaces map to _skeleton_ protocols. A skeleton protocol specifies an instance method for each
operation on the corresponding Slice interface. For example, consider our Slice definition for the `Node` interface:

```slice
module Filesystem
{
    interface Node
    {
        idempotent string name();
    }
    // ...
}
```

The Slice compiler generates the following definitions for this interface:

```swift
// Skeleton protocol
public protocol Node: Ice.Dispatcher {
    func name(current: Ice.Current) async throws -> Swift.String
}

extension Node {
    public func dispatch(
        _ request: sending Ice.IncomingRequest) async throws ->
            Ice.OutgoingResponse {
        ...
    }
}
```

The important points to note here are:

- For each Slice interface `<interface-name>`, the compiler generates a Swift protocol `<interface-name>` (`Node` in
  this example).
- This skeleton protocol extends `Ice.Dispatcher`, and the Slice compiler generates an extension for the skeleton
  protocol that implements `dispatch` (Dispatcher’s only method).
- The base servant protocol in Swift is `Ice.Dispatcher`; skeleton protocols do not derive from `Ice.Object`.

### Servant Implementation

In order to provide an implementation for an Ice object, you must create a servant struct, class or actor that adopts
the corresponding skeleton protocol. For example, to create a servant for the `Node` interface, you could write:

```swift
struct MNode: Node {
    private let name: String

    init(name: String) {
        self.name = name
    }

    func name(current _: Ice.Current) -> String {
        name
    }
}
```

Note that `MNode` adopts `Node`, the skeleton protocol.

As far as Ice is concerned, the `MNode` struct must implement only a single method: the `name` method from its skeleton.
This makes the servant struct a concrete type that can be instantiated. You can add other methods and fields as you see
fit to support your implementation. For example, in the preceding definition, we added a `name` field and an
initializer.

{% /language-section %}
