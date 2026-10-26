{% language-section name="mapping" %}

## Client-Side Mapping for Interfaces

### Proxy Objects

In PHP, a single class, `Ice\ObjectPrx`, implements the proxies of every Slice interface. Each proxy carries the
definition of one Slice interface, its _type information_, and acts as a proxy for that interface. A proxy whose type
information is interface `Simple` is a _proxy for `Simple`_: besides the `ice_` methods of `ObjectPrx`, you can call the
operations of `Simple` on it, including the operations `Simple` inherits.

### Creating a Proxy

For each Slice interface, the Slice-to-PHP compiler creates a helper class: for an interface `Simple`, the name of the
generated helper class is `SimplePrxHelper`.

This helper class provides the `createProxy` method. For an interface `Simple` in module `M`, this helper class is:

```php
namespace M
{
    class SimplePrxHelper
    {
        public static function createProxy($communicator, $proxyString)
    }
}
```

Use `createProxy` to create a proxy for `Simple` from a communicator and a “stringified” proxy. For example:

```php
$simple = M\SimplePrxHelper::createProxy(
    $communicator,
    'simple:tcp -h localhost -p 4061');
```

### Interface Inheritance

```slice
interface A { ... }
interface B { ... }
interface C extends A, B { ... }
```

Given a proxy for `C`, a client can invoke any operation defined for interface `C`, as well as any operation inherited
from `C`'s base interfaces.

### Attaching Type Information to a Proxy

In addition to `createProxy`, the generated helper class provides two static methods that return a copy of a proxy with
the type information of the helper's interface:

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

#### uncheckedCast

The helper’s `uncheckedCast` static method attaches the type information of its interface to any proxy, without
contacting the target object. For example:

```php
// Create a proxy for Widget from a proxy for Simple, even though the two interfaces are unrelated.
$widget = M\WidgetPrxHelper::uncheckedCast($simple);
```

`uncheckedCast` is a local operation that always succeeds.

#### checkedCast

`checkedCast` first makes a remote call to the target object to check if this object implements the helper's Slice
interface. For example:

```php
// Call operation ice_isA on the Ice object to check if it implements Slice interface
// Widget.
$widget = M\WidgetPrxHelper::checkedCast($simple);
```

If the target object implements the Slice interface, `checkedCast` returns a proxy for this interface, just like
`uncheckedCast`. If the target object doesn’t implement this interface, `checkedCast` returns null. `checkedCast` can
also throw an exception, for example if it cannot reach the remote object.

Use `uncheckedCast` when you know the target object implements the Slice interface, and `checkedCast` when you need to
ask the target object whether it implements this interface. You rarely need either: you usually
[create a proxy](../../runtime/invocation/creating-proxies#creating-a-proxy-of-another-type) for the interface you need
directly.

### Proxy Factory Methods

The `ObjectPrx` class supports a variety of methods for customizing a proxy. Since proxies are immutable, each of these
factory methods returns a copy of the original proxy that contains the desired modification. For example, you can obtain
a proxy configured with a ten second invocation timeout as shown below:

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(...);

// Create a new Greeter proxy and assign it to $greeter.
$greeter = $greeter->ice_invocationTimeout(10000);
```

The factory methods keep the type information of the proxy they copy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`, which return a proxy for `Ice::Object`: the
new facet or identity can designate an object of another type. Attach the type information of that type with its helper
before you invoke an operation on this proxy. For example:

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(...);
$greeterAdmin = VisitorCenter\GreeterAdminPrxHelper::uncheckedCast(
    $greeter->ice_facet("admin"));
```

{% /language-section %}
