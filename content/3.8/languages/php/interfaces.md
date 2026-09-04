---
id: interfaces
language: php
---

{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

# Proxy Objects

Slice interfaces are implemented by instances of the
\`Ice\ObjectPrx`class in PHP. In the client's address space, an instance of`ObjectPrx` is the local ambassador for a
remote Ice object in a server and is known as a _proxy instance_. All the details about the server-side object, such as
its address, what protocol to use, and its object identity are encapsulated in that instance.

The PHP mapping for proxies differs from other Ice language mappings in that the `ObjectPrx` class is used to implement
_all_ Slice interfaces. The primary motivation for this design is minimizing the amount of code that is generated for
each interface.

Nevertheless, you need to downcast a proxy to a specific Slice interface before you can invoke operations using this
proxy, as described on this page.

# Creating a Proxy

For each Slice interface, apart from the proxy interface, the Slice-to-PHP compiler creates a helper class: for an
interface `Simple`, the name of the generated helper class is `SimplePrxHelper`.

This helper class provides the `createProxy` method. With our previous example:

```php
namespace M
{
    class SimplePrxHelper
    {
        public static function createProxy($communicator, $proxyString)
    }
}
```

Use `createProxy` to create a proxy from a communicator and a “stringified” proxy. For example:

```php
$simple = M\SimplePrxHelper::createProxy(
    communicator,
    'simple:tcp -h localhost -p 4061');
```

# Interface Inheritance

```slice
interface A { ... }
interface B { ... }
interface C extends A, B { ... }
```

Given a proxy that has been down-casted to `C`, a client can invoke any operation defined for interface `C`, as well as
any operation inherited from `C`'s base interfaces.

# Casting a Proxy

In addition to `createProxy`, the generated helper class provides two static methods for converting a proxy into a proxy
of another type:

```php
namespace M
{
    class SimplePrxHelper
    {
        public static function uncheckedCast($proxy, $facet=null)

        public static function checkedCast($proxy, ...$args)
    }
}
```

## uncheckedCast

The helper’s `uncheckedCast` static method allows you to convert any proxy into a proxy of this type. For example:

```php
// Convert a SimplePrx into a WidgetPrx, even though the two types are unrelated.
$widget = M\WidgetPrxHelper::uncheckedCast($simple);
```

`uncheckedCast` is a local operation that always succeeds.

## checkedCast

`checkedCast` is a conditional cast of the proxy: this method makes a remote call to the target object to check if this
object implements the proxy’s Slice interface. For example:

```php
// Call operation ice_isA on the Ice object to check if it implements Slice interface
// Widget.
$widget = M\WidgetPrxHelper::checkedCast($simple);
```

If the target object implements the Slice interface, `checkedCast` returns a non-null proxy, just like `uncheckedCast`.
If the target object doesn’t implement this interface, `checkedCast` returns null. `checkedCast` can also throw an
exception, for example if it cannot reach the remote object.

While `checkedCast` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in practice
you know or should know the type of your proxies and calling `checkedCast` is rarely necessary.

# Proxy Factory Methods

The base proxy interface `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(...);

// Create a new GreeterPrx and assign it to $greeter.
$greeter = $greeter->ice_invocationTimeout(10000);
```

The factory methods usually return a proxy of the same type as the current proxy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these methods may produce
a proxy for an object of an unrelated type, and you need to cast the returned proxy. For example:

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(...);
$greeterAdmin = VisitorCenter\GreeterAdmin::uncheckedCast(
    $greeter->ice_facet("admin"));
```

{% /language-section %}
