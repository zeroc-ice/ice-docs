{% language-section name="mapping" %}

## Client-Side Mapping for Interfaces

### Proxy Classes

On the client side, a Slice interface maps to a Python class with methods that correspond to the operations on that
interface. Consider the following Slice interface:

```slice
interface Simple
{
    void op();
}
```

The Python mapping generates the following definition for use by the client:

```py
class SimplePrx(Ice.ObjectPrx):

    def op(self, context: dict[str, str] | None = None) -> None:
        ...

    def opAsync(self, context: dict[str, str] | None = None) -> Awaitable[None]:
        ...
```

As you can see, the compiler generates a _proxy class_ `SimplePrx`. In general, the generated name is
`<interface-name>Prx`.

In the client's address space, an instance of `SimplePrx` is the local ambassador for a remote instance of an Ice object
that implements `Simple` and is known as a _proxy instance_. All the details about the server-side object, such as its
address, what protocol to use, and its object identity are encapsulated in that instance.

### Inheritance from `Ice.ObjectPrx`

All generated proxy classes inherit directly or indirectly from the `Ice.ObjectPrx` class, reflecting the fact that all
Slice interfaces implicitly inherit from `Object`.

### Creating a Proxy

Use the constructor of the generated proxy class to create a proxy from a communicator and a “stringified” proxy. For
example:

```py
import M

simple = M.SimplePrx(communicator, "simple:tcp -h localhost -p 4061")
```

`__init__` is inherited from `Ice.ObjectPrx`.

### Interface Inheritance

Inheritance relationships among Slice interfaces are maintained in the generated Python classes. For example:

```slice
interface A { ... }
interface B { ... }
interface C extends A, B { ... }
```

The generated code for `CPrx` reflects the inheritance hierarchy:

```py
class CPrx(APrx, BPrx):
    ...
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

### Casting Proxies in Python

The Python mapping for a proxy also generates 3 static methods for converting a proxy into a proxy of another type:

```py
class SimplePrx(Ice.ObjectPrx):
    @staticmethod
    def uncheckedCast(proxy, facet=None)

    @staticmethod
    def checkedCastAsync(proxy, facet=None, context=None)

    @staticmethod
    def checkedCast(proxy, facet=None, context=None)
```

#### uncheckedCast

`uncheckedCast` allows you to convert any proxy into a `SimplePrx` proxy. For example:

```py
# Convert a SimplePrx into a WidgetPrx, even though the two types are unrelated.
widget = WidgetPrx.uncheckedCast(simple)
```

`uncheckedCast` is a local operation that always succeeds.

#### checkedCastAsync

`checkedCastAsync` is a conditional cast of the proxy: this method makes a remote call to the target object to check if
this object implements the proxy’s Slice interface. For example:

```py
# Call operation ice_isA on the Ice object to check if it implements Slice interface
# Widget.
widget = await WidgetPrx.checkedCastAsync(simple)
```

If the target object implements the Slice interface, `checkedCastAsync` returns a non-null proxy, just like
`uncheckedCast`. If the target object doesn’t implement this interface, `checkedCastAsync` returns None.
`checkedCastAsync` can also throw an exception, for example if it cannot reach the remote object.

While `checkedCastAsync` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in
practice you know or should know the type of your proxies and calling `checkedCastAsync` is rarely necessary.

#### checkedCast

`checkedCast` is the synchronous equivalent of `checkedCastAsync`: it blocks the caller until the response it receives.
You should prefer async methods over their their synchronous equivalent when making remote calls with Ice.

### Proxy Factory Methods

The base proxy class `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```py
greeter = VisitorCenter.GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")

# Create a new GreeterPrx and assign it to greeter.
greeter = greeter.ice_invocationTimeout(10000)
```

The factory methods usually return a proxy of the same type as the current proxy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these methods may produce
a proxy for an object of an unrelated type, and you need to cast the returned proxy. For example:

```py
greeter = VisitorCenter.GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
greeterAdmin = VisitorCenter.GreeterAdminPrx.uncheckedCast(
  greeter.ice_facet("admin"))
```

## Server-Side Mapping for Interfaces

### Skeleton Classes

On the server side, interfaces map to _skeleton classes_. A skeleton is an abstract base class from which you derive
your servant class and define a method for each operation on the corresponding interface. For example, consider our
Slice definition for the `Node` interface:

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

The Python mapping generates the following definition for this interface:

```py
class Node(Ice.Object, ABC):
    @abstractmethod
    def name(self, current: Current) -> str | Awaitable[str]:
        pass
```

The important points to note here are:

- As for the client side, Slice modules are mapped to Python packages with the same name, so the skeleton class
  definitions are part of the `Filesystem` package.
- The name of the skeleton class is the same as the Slice interface (`Node`).
- The skeleton class is an abstract base class with an abstract method for each operation defined in the Slice
  interface.
- The skeleton class inherits from `Ice.Object` (which forms the root of the Ice object hierarchy).

### `Ice.Object` Servant Base Class

The Slice pseudo-interface `Object` is mapped to the `Ice.Object` class in Python.

### Servant Classes

In order to provide an implementation for an Ice object, you must create a servant class that inherits from the
corresponding skeleton class. For example, to create a servant for the `Node` interface, you could write:

```py
from Filesystem import Node
import Ice

class MNode(Node):
    def __init__(self, name: str):
        self._name = name

    def name(self, _: Ice.Current) -> str:
        return self._name
```

Note that `MNode` implements `Node`, the skeleton class.

As far as Ice is concerned, the `MNode` class must implement only a single method: the abstract method `name`. This
makes the servant class a concrete class that you can instantiate. You can add other methods and attributes as you see
fit to support your implementation. For example, in the preceding definition, we added a `_name` instance attribute and
an initializer.

{% /language-section %}
