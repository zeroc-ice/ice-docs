{% language-section name="language-mapping" %}

## Client-Side Mapping for Interfaces

### Proxy Classes

On the client side, a Slice interface maps to a JavaScript class with methods that correspond to the operations on that
interface. Consider the following Slice interface:

```slice
interface Simple
{
    void op();
}
```

The Slice compiler generates code like:

```js
class SimplePrx extends Ice.ObjectPrx {
    op(context) { ... }
}
```

```typescript
export namespace M {
    export class SimplePrx extends Ice.ObjectPrx {
        op(context?: Map<string, string>): Ice.AsyncResult<void>;
    }
}
```

As you can see, the compiler generates a _proxy type_ `SimplePrx`. In general, the generated name is
`<interface-name>Prx`.

In the client's address space, an instance of `SimplePrx` is the local ambassador for a remote instance of an Ice object
that implements `Simple` and is known as a proxy instance. All the details about the server-side object, such as its
address, what protocol to use, and its object identity are encapsulated in that instance.

{% callout type="note" %}

Ice.AsyncResult is a class derived from the standard JavaScript Promise class. The generated operations are always
asynchronous.

{% /callout %}

### Creating a Proxy

Use the constructor of the generated class to create a proxy from a communicator and a “stringified” proxy. For example:

```typescript
const simple = new M.SimplePrx(
    communicator,
    "simple:tcp -h localhost -p 4061");
```

### Inheritance from `Ice.ObjectPrx`

All generated proxy classes inherit directly from the `Ice.ObjectPrx` class, reflecting the fact that all Slice
interfaces implicitly inherit from `Object`.

### Interface Inheritance

Slice interface inheritance is **preserved in the generated TypeScript declarations**, but **not** in the emitted
JavaScript at runtime.

```slice
interface A { ... }
interface B { ... }
interface C extends A, B { ... }
```

The generated proxy class looks like:

```js
M.CPrx = class extends Ice.ObjectPrx {
 ...
};
```

At runtime, the operations from `APrx` and `BPrx` are **copied onto** `CPrx.prototype` (no JavaScript class inheritance
chain is used). This has two important consequences:

- You can call any operation from Slice interface `A` or `B` on a `CPrx` instance, because those methods are present on
  `CPrx.prototype`.
- However, c instanceof M.APrx (or M.BPrx) is **false**, since CPrx does not inherit from `APrx` or `BPrx` in
  JavaScript.

You can still pass a `CPrx` wherever an `APrx` or `BPrx` is expected—TypeScript’s generated declarations model this with
implements, so the type checker accepts such usages even though the JavaScript runtime does not establish an inheritance
relationship between the proxy classes.

```typescript
export class CPrx extends Ice.ObjectPrx implements M.APrx, M.BPrx {
 ...
}
```

### Casting a Proxy

The generated proxy class provides two static methods for converting a proxy into a proxy of another type:

```typescript
export class SimplePrx extends Ice.ObjectPrx {
    static uncheckedCast(prx: Ice.ObjectPrx, facet?: string): SimplePrx;

    static checkedCast(
        prx: Ice.ObjectPrx,
        facet?: string,
        context?: Map<string, string>): Promise<SimplePrx | null>;
}
```

#### uncheckedCast

The `uncheckedCast` static method allows you to convert any proxy into a proxy of this type. For example:

```typescript
// Convert a SimplePrx into a WidgetPrx, even though the two types are
// unrelated.
const widget = M.WidgetPrx.uncheckedCast(simple);
```

`uncheckedCast` is a local operation that always succeeds.

#### checkedCast

`checkedCast` is a conditional cast of the proxy: this method makes a remote call to the target object to check if this
object implements the proxy’s Slice interface. For example:

```typescript
// Call operation ice_isA on the Ice object to check if it implements
// Slice interface Widget.
const widget = await M.WidgetPrx.checkedCast(simple);
```

If the target object implements the Slice interface, `checkedCast` returns a new proxy, just like `uncheckedCast`. If
the target object doesn’t implement this interface, `checkedCast` returns null. `checkedCast` can also throw an
exception, for example if it cannot reach the remote object.

While `checkedCast` sounds safer than `uncheckedCast` (you’re making an additional check before casting), in practice
you know or should know the type of your proxies and calling `checkedCast` is rarely necessary.

### Proxy Factory Methods

The base proxy class `ObjectPrx` supports a variety of methods for customizing a proxy. Since proxies are immutable,
each of these factory methods returns a copy of the original proxy that contains the desired modification. For example,
you can obtain a proxy configured with a ten second invocation timeout as shown below:

```typescript
import { VisitorCenter } from "./Greeter.js"
let greeter = new VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
greeter = greeter.ice_invocationTimeout(10000);
```

The factory methods usually return a proxy of the same type as the current proxy, as in the example above.

The only exceptions are the factory methods `ice_facet` and `ice_identity`. Calls to either of these methods may produce
a proxy for an object of an unrelated type, and you need to cast the returned proxy. For example:

```typescript
import { VisitorCenter } from "./Greeter.js"

const greeter = new VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
const greeterAdmin = VisitorCenter.GreeterAdminPrx.uncheckedCast(
    greeter.ice_facet("admin"));
```

## Server-Side Mapping for Interfaces

### Skeleton Classes

On the server side, interfaces map to _skeleton_ classes. A skeleton is a type that conceptually has an abstract method
for each operation on the corresponding interface. For example, consider our Slice definition for the `Node` interface:

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

The Slice compiler generates the following definition for this interface:

```js
class Node extends Ice.Object {
    ...
}
```

```typescript
abstract class Node extends Ice.Object {
    abstract name(current:Ice.Current): PromiseLike<string>|string;
}
```

The important points to note here are:

- As for the client side, Slice modules are mapped to JavaScript objects with the same name, so the skeleton definitions
  are part of the `Filesystem` object.

- For each Slice interface `<interface-name>`, the compiler generates a JavaScript class `<interface-name>` (`Node` in
  this example). This type extends `Ice.Object` and serves as the actual skeleton; it is the base type from which you
  derive your servant implementation.

### Servant Classes

In order to provide an implementation for an Ice object, you must create a servant class that inherits from the
corresponding skeleton. For example, to create a servant for the `Node` interface, you could write:

```typescript
class MNode extends Filesystem.Node {
    _name:string;

    constructor(name:string) {
        super();
        this._name = name;
    }

    name(current:Ice.Current) {
        return this._name;
    }
}
```

Note that `MNode` extends `Filesystem.Node`, the skeleton class.

As far as Ice is concerned, the `MNode` class must implement only a single method: the abstract method `name`. This
makes the servant class a concrete class that you can instantiate. You can add other methods and fields as you see fit
to support your implementation. For example, in the preceding definition, we added a `_name` field and a constructor.

{% /language-section %}
