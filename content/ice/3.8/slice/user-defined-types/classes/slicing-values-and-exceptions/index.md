---
title: Slicing Values and Exceptions
---

This page describes the concept of _slicing_, which is how the Ice runtime reacts when it receives an instance of an
unknown [class](../classes) or [exception](../exceptions).

## Composition using Slices

Classes and exceptions are composed of slices, where each slice corresponds to a level in the type hierarchy and
contains the data members defined at that level. Consider this example showing a class hierarchy:

```slice
class A
{
    int i;
}

class B extends A
{
    float f;
}

class C extends B
{
    string s;
}
```

An instance of class `C` contains the following slices, listed in order from most-derived to least-derived:

| **Slice** | **Contents** |
| --------- | ------------ |
| `C`       | `string s`   |
| `B`       | `float f`    |
| `A`       | `int i`      |

Let's add the following interface to our discussion:

```slice
interface I
{
    B getValue();
}
```

Now suppose a client invokes `getValue`. Let's also suppose that the server actually returns an instance of class `C`,
which is legal given that `C` derives from `B`. The Ice runtime in the client knows that the formal return type of the
`getObject` operation is `B`, therefore `B` is the least-derived type that the client can accept for this operation. At
a high level, the Ice runtime in the client behaves as follows:

1. It discovers that the most-derived type of the returned instance is `C` and checks whether this type is known.
2. If this type is known to the client, Ice instantiates the object, extracts the fields for each of its slices, and
   returns the object.
3. If type `C` is _not_ known to the client, which can occur when the client and server are using different versions of
   the Slice definitions, Ice discards the fields for slice `C` (also known as _slicing_ the object) and tries again
   with the next slice.
4. If type `B` is also not known to the client then we have a problem. First, from a logical standpoint, the client
   _must_ know type `B` because it is the statically-declared return type of the operation that the client just invoked.
   Second, we cannot slice this object any further because it would no longer be compatible with the formal signature of
   the operation; the returned object must at least be an instance of `B`, so we could not return an instance of `A`. In
   either case, the Ice runtime would throw an exception.

Generally speaking, upon receipt of an instance of a class or exception, the Ice runtime discards the slices of unknown
types until it finds a type that it recognizes, exhausts all slices, or can no longer satisfy the formal type signature
of the operation. This slicing feature allows the receiver, whose Slice definitions may be limited or outdated, to
continue to function properly even when it does not recognize the most-derived type.

## Slice Formats

Ice provides two on-the-wire formats for class and exception slices: the compact format and the sliced format. Ice uses
the compact format by default, which is more space-efficient on the wire but offers less flexibility on the receiving
end.

An application that needs the slicing behavior we discussed in the previous section must explicitly enable the sliced
format as follows:

- Set the [Ice.Default.SlicedFormat](../ice-default-properties) property to a non-zero value to force the Ice runtime to
  use the sliced format by default.
- Annotate your Slice definitions with the `format:sliced` [metadata](../slice-metadata-directives) to selectively
  enable the sliced format for certain operations or interfaces.

For example, suppose an application can safely use the compact format most of the time, but still needs slicing in a few
situations. In this case the application can use metadata to enable the sliced format where necessary:

```slice
interface Ledger
{
    Account getAccount(string id); // Uses compact format

    ["format:sliced"]
    Account importAccount(string source); // Uses sliced format
}
```

The semantics implied by these definitions state that the caller of `getAccount` assumes it will know every type that
that might be returned, but the same cannot be said for `importAccount`. By enabling the sliced format here, we allow
the client to "slice off" what it does not recognize, even if that means the client is left with only an instance of
`Account` and not an instance of some derived type.

Now let's examine the opposite case: use the sliced format by default, and the compact format only in certain cases:

```slice
["format:sliced"]
interface Ledger
{
    ["format:compact"]
    Account getAccount(string id); // Uses compact format

    Account importAccount(string source); // Uses sliced format
}
```

Here we specify that all operations in `Ledger` use the sliced format unless overridden at the operation level, which we
do for `getAccount`.

The format affects the marshaling of input parameters, output parameters, and return value of an operation.

{% callout type="info" %}

As of Ice 3.8, exceptions are always marshaled in the sliced format.

{% /callout %}

Consider this example:

```slice
exception IncompatibleAccount { ... }

interface Ledger
{
    ["format:compact"]
    Account migrateAccount(Account oldAccount) throws IncompatibleAccount;
}
```

The metadata forces the client to use the compact format for the input parameter `oldAccount`, and forces the server to
use the compact format for the return value.

If you decide to use the `Ice.Default.SlicedFormat` property, be aware that this property only affects the sender of a
value or exception. For example, if you enable this property in the client but not the server, then all values sent by
the client use the sliced format by default, but all values returned by the server use the compact format by default.

By offering two alternative formats, Ice gives you a great deal of flexibility in designing your applications. The
compact format is ideal for applications that place a greater emphasis on efficiency, while the sliced format is helpful
when clients and servers evolve independently.

## Preserving Slices

The concept of slicing involves discarding the slices of unknown types when receiving an instance of a Slice class or
exception. Here is a simple example:

```slice
class Base
{
    int b;
}

class Intermediate extends Base
{
    int i;
}

class Derived extends Intermediate
{
    int d;
}

interface Relay
{
    ["format:sliced"]
    Base transform(Base b);
}
```

The server implementing the `Relay` interface must know the type `Base` (because it is statically referenced in the
interface definition), but may not know `Intermediate` or `Derived`. Suppose the implementation of `transform` involves
forwarding the instance to another back-end server for processing and returning the transformed instance to the caller.
In effect, the `Relay` server is an intermediary. If the `Relay` server does not know the types `Intermediate` and
`Derived`, it will slice an instance to `Base` and discard the data members of any more-derived types, which is clearly
not the intended result because the back-end server _does_ know those types. The only way the `Relay` server could
successfully forward these instances is by knowing all possible derived types, which makes the application more
difficult to evolve over time because the intermediary must be updated each time a new derived type is added.

To address this limitation, the unmarshaling of a class instance with unknown slices does not discard these slices, but
preserves them (in encoded form). This way, when `transform` returns the class instance (after processing), the skipped
slices are automatically “reattached”.

{% callout type="info" %}

Slice preservation requires the sliced format, and applies only to classes.

Exceptions are always marshaled in the sliced format (to allow slicing) but exception slices are never preserved.

{% /callout %}

If a class instance is sliced upon receipt, calling `ice_getSlicedData` on this instance will return a
[SlicedData](https://code.zeroc.com/manual/Ice/SlicedData) object that hold the preserved slices.

## Unknown Sliced Values

Suppose we modify our `Relay` example as shown below:

```slice
class Base
{
    int b;
}

class Intermediate extends Base
{
    int i;
}

class Derived extends Intermediate
{
    int d;
}


interface Relay
{
    ["format:sliced"]
    Value transform(Value b);
}
```

The only difference here is the signature of the `transform` operation, which now uses the `Value` type. Technically, it
is not necessary for the intermediary server to know _any_ of the class types that might be relayed via this new
definition of `transform` because the formal types in its signature do not impose any requirements. As long as the
`transform` operation uses the sliced format, this intermediary is capable of relaying values of any type.

If the Ice runtime in the intermediary does not know any of the types in an object's inheritance hierarchy, and the
formal type is `Value`, Ice uses an instance of
[UnknownSlicedValue](https://code.zeroc.com/manual/Ice/UnknownSlicedValue) to represent the instance.

The implementation of `transform` receives an instance of `UnknownSlicedValue` and can use that object as its return
value. If necessary, the implementation can determine the most-derived type of the instance by calling `ice_id`.
