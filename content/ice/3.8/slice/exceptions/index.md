---
title: Exceptions
---

## Exception Syntax and Semantics

A Slice exception defines an error that an operation can report to its caller. Exceptions defined in Slice are called
_user exceptions_, to distinguish them from the
[exceptions of the Ice runtime](../../runtime/local-and-dispatch-exceptions). For example:

```slice
struct TimeOfDay
{
    short hour;         // 0 - 23
    short minute;       // 0 - 59
    short second;       // 0 - 59
}

exception TimeException {} // Empty exceptions are legal

exception RangeException
{
    TimeOfDay errorTime;
    TimeOfDay minTime;
    TimeOfDay maxTime;
}
```

A user exception is much like a structure in that it contains a number of fields. However, unlike structures, exceptions
can have zero fields, that is, be empty. Like classes, user exceptions support inheritance and may include
[optional fields](../fields).

## Exception Specification in Operations

Exceptions allow you to return an arbitrary amount of error information to the client if an error condition arises in
the implementation of an operation. Operations use an exception specification to indicate the exceptions that may be
returned to the client:

```slice
interface Clock
{
    idempotent TimeOfDay getTime();
    idempotent void setTime(TimeOfDay time)
        throws RangeException, TimeException;
}
```

`setTime` can throw a `RangeException` or a `TimeException`. A `RangeException` reports the `TimeOfDay` value that
caused the error and the range of legal values; a `TimeException` reports only that `setTime` failed.

To indicate that an operation does not throw any user exception, simply omit the exception specification. (There is no
empty exception specification in Slice.)

### Restrictions for User Exceptions

An exception is not a data type: you cannot use an exception as the type of a parameter, a return value, a field, a
sequence element, or a dictionary key or value. Conversely, an exception specification lists only exceptions.

## Exception Inheritance

Slice exceptions support single inheritance. A derived exception inherits the fields of its base exception and can add
its own, but cannot redefine an inherited field:

```slice
exception BaseException
{
    string reason;
}

exception DerivedException extends BaseException
{
    int code;
}

interface Example
{
    // May throw BaseException or DerivedException
    void op() throws BaseException;
}
```

An operation can throw any exception derived from the exceptions in its exception specification: `op` can throw a
`BaseException` or a `DerivedException`. The language mappings preserve the exception hierarchy, so you can catch a base
exception generically or handle specific derived exceptions.

As a system evolves, new derived exceptions are often added to an existing hierarchy. Suppose that you add
`FatalApplicationException` to the original definitions and redeploy the server:

```slice
exception AppException
{
    // ...
}

exception FatalApplicationException extends AppException
{
    // ...
}

interface Application
{
    void doSomething() throws AppException;
}
```

A client built with the original definition does not know `FatalApplicationException`: Ice slices the exception to
`AppException`, the most-derived type this client knows.

See [Slicing Values and Exceptions](../user-defined-types/classes/slicing-values-and-exceptions) for the rules Ice
follows when it slices an exception.

## Language Mapping

{% language-section name="mapping" /%}

## See Also

- [Local and Dispatch Exceptions](../../runtime/local-and-dispatch-exceptions)
