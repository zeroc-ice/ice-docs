---
title: Exceptions
---

# Exception Syntax and Semantics

Consider the following Slice definition.

```
struct TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}

interface Clock
{
    idempotent void setTime(TimeOfDay time);
}
```

There’s a potential problem: given that the `TimeOfDay` structure uses `short` as the type of each field, what will
happen if a client invokes the `setTime` operation and passes a `TimeOfDay` value with meaningless field values, such as
`-199` for the minute field, or `42` for the hour? Obviously, it would be nice to provide some indication to the caller
that this is meaningless. Slice allows you to define exceptions to indicate error conditions to the client. These
Slice-defined exceptions are called _user exceptions_.

For example:

```slice
exception TimeException {} // Empty exceptions are legal

exception RangeException
{
    TimeOfDay errorTime;
    TimeOfDay minTime;
    TimeOfDay maxTime;
}
```

A user exception is much like a structure in that it contains a number of fields. However, unlike structures, exceptions
can have zero fields, that is, be empty. Like classes, user exceptions support inheritance and may include
[optional fields](../fields).

{% callout type="info" %}

Even though user exceptions are nominally exceptions that you throw and catch, it’s better to think of them as error
results. You may receive a user exception only when you call a Slice operation.

{% /callout %}

# Exception Specification in Operations

Exceptions allow you to return an arbitrary amount of error information to the client if an error condition arises in
the implementation of an operation. Operations use an exception specification to indicate the exceptions that may be
returned to the client:

```slice
interface Clock
{
    idempotent TimeOfDay getTime();
    idempotent void setTime(TimeOfDay time)
        throws RangeException, TimeException;
}
```

This definition indicates that the `setTime` operation may throw either a `RangeException` or a `TimeException`
exception (and no other type of exception). If the client receives a `RangeException`, the exception contains the
`TimeOfDay` value that was passed to `setTime` and caused the error (in the `errorTime` field), as well as the minimum
and maximum time values that can be used (in the `minTime` and `maxTime` fields). If `setTime` failed because of an
error not caused by an illegal parameter value, it throws a `TimeException`. Obviously, because `TimeException` does not
have fields, the client will have no idea what exactly it was that went wrong — it simply knows that the operation did
not work.

To indicate that an operation does not throw any user exception, simply omit the exception specification. (There is no
empty exception specification in Slice.)

The server-side Ice runtime does not verify that a user exception thrown by an operation is compatible with the
exceptions listed in its Slice definition, although your implementation language may enforce its own restrictions. The
Ice runtime in the client does validate user exceptions and throws `UnknownUserException` if it receives an unexpected
user exception.

## Restrictions for User Exceptions

Exceptions are not first-class data types and first-class data types are not exceptions:

- You cannot pass an exception as a parameter value.
- You cannot use an exception as the type of a field.
- You cannot use an exception as the element type of a sequence.
- You cannot use an exception as the key or value type of a dictionary.
- You cannot throw a value of non-exception type (such as a value of type `int` or `string`).

The reason for these restrictions is that some implementation languages use a specific and separate type for exceptions
(in the same way as Slice does). For such languages, it would be difficult to map exceptions if they could be used as an
ordinary data type.

# Exception Inheritance

Slice Exceptions support inheritance. For example:

```slice
exception BaseException 
{
    string reason;
}

enum RTError
{
    DivideByZero, NegativeRoot, IllegalNull /* ... */
}

exception RuntimeException extends BaseException
{
    RTError err;
}

enum LError { ValueOutOfRange, ValuesInconsistent, /* ... */ }

exception LogicException extends BaseException
{
    LError err;
}

exception RangeException extends LogicException
{
    TimeOfDay errorTime;
    TimeOfDay minTime;
    TimeOfDay maxTime;
}
```

These definitions set up a simple exception hierarchy:

- `BaseException` is at the root of the tree and contains a string explaining the cause of the error.
- Derived from `BaseException` are `RuntimeException` and `LogicException`. Each of these exceptions contains an
  enumerated value that further categorizes the error.
- Finally, `RangeException` is derived from `LogicException` and reports the details of the specific error.

Setting up exception hierarchies such as this not only helps to create a more readable specification because errors are
categorized, but also can be used at the language level to good advantage. For example, the Slice C++ mapping preserves
the exception hierarchy so you can catch exceptions generically as a base exception, or set up exception handlers to
deal with specific exceptions.

Note that, if the exception specification of an operation indicates a specific exception type, at runtime, the
implementation of the operation may also throw more derived exceptions. For example:

```slice
exception BaseException
{
    // ...
}

exception DerivedException extends BaseException
{
    // ...
}

interface Example
{
    // May throw BaseException or DerivedException
    void op() throws BaseException;
}
```

In this example, `op` may throw a `BaseException` or a `DerivedException` exception, that is, any exception that is
compatible with the exception types listed in the exception specification can be thrown at runtime.

As a system evolves, it is quite common for new, derived exceptions to be added to an existing hierarchy. Assume that we
initially construct clients and server with the following definitions:

```slice
exception AppException
{
    // ...
}

interface Application
{
    void doSomething() throws AppException;
}
```

Also assume that a large number of clients are deployed in field, that is, when you upgrade the system, you cannot
easily upgrade all the clients. As the application evolves, a new exception is added to the system and the server is
redeployed with the new definition:

```slice
exception AppException
{
    // ...
}

exception FatalApplicationException extends AppException
{
    // ...
}

interface Application
{
    void doSomething() throws AppException;
}
```

This raises the question of what should happen if the server throws a `FatalApplicationException` from `doSomething`.
The answer depends whether the client was built using the old or the updated definition:

- If the client was built using the same definition as the server, it simply receives a `FatalApplicationException`.
- If the client was built with the original definition, that client has no knowledge that `FatalApplicationException`
  even exists. In this case, the Ice runtime automatically slices the exception to the most-derived type that is
  understood by the receiver (`AppException`, in this case) and discards the information that is specific to the derived
  part of the exception.

{% callout type="info" %}

The exception slicing occurs when the exception is marshaled by the server using the sliced format. Started with Ice
3.8, exceptions are always marshaled in the sliced format. In Ice 3.7 and prior releases, you need to enable the sliced
format explicitly.

{% /callout %}

# Language Mapping

{% language-section name="lang-1" /%}

##### See Also

- [Local and Dispatch Exceptions](../local-and-dispatch-exceptions)
