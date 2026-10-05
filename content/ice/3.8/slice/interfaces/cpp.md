{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

### Proxy Classes

On the client side, a Slice interface maps to a C++ proxy class with member functions that correspond to the operations
on that interface. Consider the following Slice interface:

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

```cpp
class SimplePrx : public Ice::Proxy<SimplePrx, Ice::ObjectPrx>
{
public:
    // Constructors
    SimplePrx(
        const Ice::CommunicatorPtr& communicator,
        std::string_view proxyString);
    SimplePrx(const SimplePrx& other) noexcept;
    SimplePrx(SimplePrx&& other) noexcept;

    // Assignment operators.
    SimplePrx& operator=(const SimplePrx& rhs) noexcept;
    SimplePrx& operator=(SimplePrx&& rhs) noexcept;

    // Member functions mapped from Slice operation op.

    void op(const Ice::Context& = Ice::noExplicitContext) const;

    [[nodiscard]] std::future<void> opAsync(
        const Ice::Context& context = Ice::noExplicitContext) const;

    std::function<void()> opAsync(
        std::function<void()> response,
        std::function<void(std::exception_ptr)> exception = nullptr,
        std::function<void(bool)> sent = nullptr,
        const Ice::Context& context = Ice::noExplicitContext) const;
};
```

Your client code interacts directly with the _proxy class_, `M::SimplePrx` in the example above. More generally, the
generated proxy class for an interface in module `M` is the C++ proxy class `M::<interface-name>Prx`.

In the client's address space, an instance of the proxy class is the local ambassador for a remote instance of an Ice
object that implements `Simple` and is known as a _proxy class instance_, or simply _proxy_. All the details about the
server-side object, such as its address, what transport to use, and its object identity are encapsulated in that
instance.

{% callout type="note" %}

Notice that all proxy member functions are `const` – proxy instances are immutable.

{% /callout %}

The `Ice::Proxy` template is a mix-in class that adds functionality to the proxy class via inheritance. It derives from
the provided base proxy classes (here, only `Ice::ObjectPrx`):

```cpp
template<typename Prx, typename... Bases>
class Proxy : public virtual Bases...
{
   // Helper functions for Prx
}
```

It’s an instance of the Curiously Recurring Template Pattern (CRTP).

### Creating a Proxy

Use the constructor of the generated class to create a proxy from a communicator and a “stringified” proxy. For example:

```cpp
M::SimplePrx simple{communicator, "simple:tcp -h localhost -p 4061"};
```

A proxy is a stack-allocated C++ object.

The proxy’s constructor does not allow you to create a “null” proxy. A nullable proxy - and by extension a null proxy -
is a proxy held in a `std::optional`. For example:

```cpp
// A nullable Simple proxy, default-initialized to std::nullopt.
std::optional<M::SimplePrx> simple;
```

### Inheritance from `Ice::ObjectPrx`

All generated proxy classes inherit indirectly from the `Ice::ObjectPrx` class, reflecting the fact that all Slice
interfaces implicitly inherit from `Object`.

### Interface Inheritance

Inheritance relationships among Slice interfaces are maintained in the generated C++ classes. For example:

```slice
module M
{
    interface A { ... }
    interface B { ... }
    interface C extends A, B { ... }
}
```

The generated code for `CPrx` reflects the inheritance hierarchy:

```cpp
namespace M
{
    class CPrx : public Ice::Proxy<CPrx, APrx, BPrx>
    {
        ...
    };
}
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

### Proxy Factory Methods

The base proxy class `Ice::ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are
immutable, each of these "factory methods" returns a copy of the original proxy that contains the desired modification.
For example, you can obtain a proxy configured with a ten second invocation timeout as shown below:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};

// Create a new GreeterPrx and assign it to greeter.
greeter = greeter.ice_invocationTimeout(10000);
```

The factory methods usually return a proxy of the same type as the current proxy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these functions may
produce a proxy for an object of an unrelated type, and you need to supply the desired proxy type when you call them.
For example:

```cpp
GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
GreeterAdminPrx greeterAdmin = greeter.ice_facet<GreeterAdminPrx>("admin");
```

## Server-Side Mapping for Interfaces

### Skeleton Classes

On the server side, interfaces map to _skeleton_ classes. A skeleton is a class that has a pure virtual member function
for each operation on the corresponding interface. For example, consider our Slice definition for the `Greeter`
interface:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

The Slice compiler generates the following classes for this interface:

```cpp
namespace VisitorCenter
{
    class Greeter : public virtual Ice::Object
    {
    public:
        void dispatch(
            IncomingRequest& request,
            std::function<void(OutgoingResponse)> sendResponse) override;

        virtual std::string greet(std::string name, const Ice::Current&) = 0;

        // ...
    };

    class AsyncGreeter : public virtual Ice::Object
    {
    public:
        void dispatch(
            IncomingRequest& request,
            std::function<void(OutgoingResponse)> sendResponse) override;

        virtual void greetAsync(
            std::string name,
            std::function<void(std::string_view returnValue)> response,
            std::function<void(std::exception_ptr)> exception,
            const Ice::Current&) = 0;
        // ...
    };
    // ...
}
```

The important points to note are:

- As for the client side, Slice modules are mapped to C++ namespaces with the same name, so the skeleton class
  definition is nested in the namespace `VisitorCenter`.
- The Slice compiler generates two skeleton classes: the default skeleton class has the same as the Slice interface
  (`Greeter` with our example), and the async skeleton class gets an additional Async prefix (`AsyncGreeter`).
- Each skeleton class contains a pure virtual member function for each operation in the Slice interface.
- Each skeleton class is an abstract base class because its member functions are pure virtual.
- Each skeleton class inherits from `Ice::Object` (which forms the root of the Ice servant hierarchy).
- Each skeleton class reimplements (overrides) the `dispatch` function defined on `Ice::Object`.

### `Ice::Object` Servant Base Class

The Slice pseudo-interface `Object` is mapped to the `Ice::Object` class in C++:

```cpp
namespace Ice
{
    class Object
    {
    public:
        /// Dispatches an incoming request and returns the corresponding outgoing
        /// response.
        virtual void dispatch(
            IncomingRequest& request,
            std::function<void(OutgoingResponse)> sendResponse);
        // ...
    };
}
```

`Object` implements `dispatch` for the 4 operations on the Slice pseudo-interface `Object`: `ice_ping`, `ice_isA`,
`ice_id` and `ice_ids`.

### Servant Classes

In order to provide an implementation for an Ice object, you must create a servant class that inherits from one of the
generated skeleton classes. For example, to create a servant for the `Greeter` interface, you could write:

```cpp
#include "Greeter.h" // Slice-generated header

class Chatbot : public VisitorCenter::Greeter
{
public:
    std::string greet(std::string name, const Ice::Current&) override;
};
```

Note that `Chatbot` derives from `VisitorCenter::Greeter`, one of the two generated skeleton classes.

As far as Ice is concerned, the `Chatbot` class must implement only a single member function: the pure virtual `greet`
function that it inherits from its skeleton. This makes the servant class a concrete class that you can instantiate. You
can add other member functions and data members as you see fit to support your implementation.

The async skeleton class is described in
[Asynchronous Method Dispatch (AMD) in C++](../operations#asynchronous-method-dispatch-amd).

{% /language-section %}
