{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

# Proxy Classes

A Slice interface maps to a MATLAB class with methods that correspond to the operations on that interface. Consider the
following Slice interface:

```slice
interface Simple
{
    void op();
}
```

The Slice compiler generates the following definition for use by the client:

```matlab
classdef SimplePrx < Ice.ObjectPrx
    methods
        function op(obj, context)
            % ...
        end
        function opAsync(obj, context)
           % ...
        end
    end
    % ...
end
```

As you can see, the compiler generates a _proxy class_ `SimplePrx`. In general, the generated name is
`<interface-name>Prx`. If an interface is nested in a module `M`, the generated class is part of namespace `M`, so the
fully-qualified name is `M.<interface-name>Prx`.

In the client's address space, an instance of `SimplePrx` is the local ambassador for a remote instance of an Ice object
that implements `Simple` and is known as a proxy instance. All the details about the server-side object, such as its
address, what protocol to use, and its object identity are encapsulated in that instance.

# Creating a Proxy

Use the inherited constructor of the generated class to create a proxy from a communicator and a “stringified” proxy.
For example:

```matlab
simple = M.Simple(communicator, 'simple:tcp -h localhost -p 4061');
```

# Inheritance from `Ice.ObjectPrx`

All generated proxy classes inherit directly or indirectly from the `Ice.ObjectPrx` class, reflecting the fact that all
Slice interfaces implicitly inherit from `Object`.

# Interface Inheritance

Inheritance relationships among Slice interfaces are maintained in the generated MATLAB classes. For example:

```slice
interface A { ... }
interface B { ... }
interface C extends A, B { ... }
```

The generated code for `CPrx` reflects the inheritance hierarchy:

```matlab
classdef CPrx < APrx & BPrx
    ...
end
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

# Casting a Proxy

The generated proxy class provides two static methods for converting a proxy into a proxy of another type:

```matlab
classdef SimplePrx < Ice.ObjectPrx
    methods(Static)
        function r = uncheckedCast(proxy)
            % ...
        end
        function r = checkedCast(proxy, context)
            % ...
        end
    end
    % ...
end
```

## uncheckedCast

The `uncheckedCast` static method allows you to convert any proxy into a proxy of this type. For example:

```matlab
% Convert a SimplePrx into a WidgetPrx, even though the two types are unrelated.
widget = M.WidgetPrx.uncheckedCast(simple);
```

`uncheckedCast` is a local operation that always succeeds.

## checkedCast

`checkedCast` is a conditional cast of the proxy: this method makes a remote call to the target object to check if this
object implements the proxy’s Slice interface. For example:

```matlab
% Call operation ice_isA on the Ice object to check if it implements Slice interface
% Widget.
widget = M.WidgetPrx.checkedCast(simple);
```

If the target object implements the Slice interface, `checkedCast` returns a new proxy, just like `uncheckedCast`. If
the target object doesn’t implement this interface, `checkedCast` returns an empty array. `checkedCast` can also throw
an exception, for example if it cannot reach the remote object.

While `checkedCast` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in practice
you know or should know the type of your proxies and calling `checkedCast` is rarely necessary.

# Proxy Factory Methods

The base proxy class `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```matlab
greeter = GreeterPrx(communicator, 'simple:tcp -h localhost -p 4061');

% Create a new GreeterPrx and assign it to greeter.
greeter = greeter.ice_invocationTimeout(10000);
```

The proxy factory methods usually return a proxy of the same type as the current proxy, like in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these methods may produce
a proxy for an object of an unrelated type, and you need to cast the returned proxy. For example:

```matlab
greeter = GreeterPrx(communicator, 'simple:tcp -h localhost -p 4061');
greeterAdmin = GreeterAdminPrx.uncheckedCast(greeter.ice_facet('admin'));
```

{% /language-section %}
