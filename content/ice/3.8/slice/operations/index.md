---
title: Operations
---

## Operation Syntax

An operation definition has a name, a return type, and zero or more parameters.

For example:

```slice
module M
{
    struct TimeOfDay
    {
        short hour;         // 0 - 23
        short minute;       // 0 - 59
        short second;       // 0 - 59
    }

    interface Clock
    {
        TimeOfDay getTime();
        void setTime(TimeOfDay time);
    }
}
```

The `getTime` operation returns a `TimeOfDay`, and the `setTime` operation returns `void`: Slice operations have no
default return type, so an operation that returns no value declares `void`.

Parameters are input parameters by default: their values go from the client to the server. An output parameter, marked
with the `out` keyword, carries a value from the server back to the client. An operation can have several input and
output parameters, and its output parameters must follow its input parameters:

```slice
module M
{
    interface CircadianRhythm
    {
        void setSleepPeriod(TimeOfDay startTime, TimeOfDay stopTime);
        void getSleepPeriod(out TimeOfDay startTime, out TimeOfDay stopTime);
        void changeSleepPeriod(
            TimeOfDay startTime,
            TimeOfDay stopTime,
            out TimeOfDay prevStartTime,
            out TimeOfDay prevStopTime);
    }
}
```

Each parameter must have a name, and a parameter cannot be both an input and an output parameter.

## Optional Parameters and Return Values

An operation's return value and parameters may be declared as optional to indicate that a program can leave their values
unset. Parameters not declared as optional are known as _required_ parameters. In the discussion below, we use
_parameter_ to refer to input parameters, output parameters, and return values.

A unique, non-negative integer _tag_ must be assigned to each optional parameter:

```slice
optional(3) bool example(optional(2) string name, out optional(1) int value);
```

The scope of a tag is limited to its operation and has no effect on other operations.

An optional parameter cannot have a class type, or a constructed type that holds a class type.

You can assign tags in any order.

An operation's signature can include any combination of required and optional parameters, but output parameters still
must follow input parameters:

```slice
bool example(
    string name,
    optional(3) string referrer,
    out optional(1) string promo,
    out int id);
```

Language mappings specify an API for passing optional parameters and testing whether a parameter is present.

## Exception Specifications

An operation lists the [user exceptions](../exceptions) it can throw in a `throws` clause:

```slice
exception BadTimeVal
{
    string reason;
}

interface Clock
{
    void setTime(TimeOfDay time) throws BadTimeVal;
}
```

See [Exception Specification in Operations](../exceptions#exception-specification-in-operations).

## Overloading Operations

Slice does not support overloading: operations in the same interface must have different names, regardless of the type
and number of their parameters. A request identifies the operation it invokes by name only.

## Idempotent Operations

An operation is idempotent when two successive invocations have the same effect as a single invocation. Operations that
do not modify the state of the object, such as `getTime` in the `Clock` interface, are idempotent; so is `setTime`, even
though it modifies the state. You mark such operations with the `idempotent` keyword:

```slice
interface Clock
{
    idempotent TimeOfDay getTime();
    idempotent void setTime(TimeOfDay time);
}
```

For an operation that is not idempotent, Ice guarantees _at-most-once_ semantics: the server dispatches each request at
most once. When Ice cannot tell whether a request reached the server, for example because the connection was lost after
Ice sent the request, it does not retry the request and reports the error to the application.

Marking an operation `idempotent` allows Ice to retry such a request, because dispatching it a second time has the same
effect as dispatching it once. See [Automatic Retries](../../runtime/invocation/automatic-retries).

{% callout type="note" %}

Datagram invocations over UDP are an exception: duplicated UDP datagrams can violate at-most-once semantics.

{% /callout %}

{% language-section name="mapping" /%}
