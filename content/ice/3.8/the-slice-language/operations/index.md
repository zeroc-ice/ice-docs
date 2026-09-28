---
title: Operations
---

# Operation Syntax

An operation definition must contain a name (the operation’s name), a return type and zero or more parameter
definitions.

For example:

```
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

The `getTime` operation has a return type of `TimeOfDay` and the `setTime` operation has a return type of `void`. You
must use `void` to indicate that an operation returns no value — there is no default return type for Slice operations.

An operation can have one or more input parameters. For example:

```slice
module M
{
    interface CircadianRhythm
    {
        void setSleepPeriod(TimeOfDay startTime, TimeOfDay stopTime);
    }
}
```

Note that the parameter name is mandatory. You cannot omit the parameter name, so the following is in error:

```slice
module M
{
    interface CircadianRhythm
    {
        void setSleepPeriod(TimeOfDay, TimeOfDay);  // Error!
    }
}
```

By default, parameters are sent from the client to the server, that is, they are input parameters. To pass a value from
the server to the client, you can use an output parameter, indicated by the `out` keyword. For example, an alternative
way to define the `getTime` operation in the `Clock` interface would be:

```slice
void getTime(out TimeOfDay time);
```

This achieves the same thing but uses an output parameter instead of the return value. As with input parameters, you can
use multiple output parameters:

```slice
module M
{
    interface CircadianRhythm
    {
        void setSleepPeriod(TimeOfDay startTime, TimeOfDay stopTime);
        void getSleepPeriod(out TimeOfDay startTime, out TimeOfDay stopTime);
    }
}
```

If you have both input and output parameters for an operation, the output parameters must follow the input parameters:

```slice
void changeSleepPeriod(
    TimeOfDay startTime,
    TimeOfDay stopTime,
    out TimeOfDay prevStartTime,
    out TimeOfDay prevStopTime);

void changeSleepPeriod(
     out TimeOfDay prevStartTime,
     out TimeOfDay prevStopTime, // Error
     TimeOfDay startTime,
     TimeOfDay stopTime);
```

Slice does not support parameters that are both input and output parameters.

# Optional Parameters and Return Values

An operation's return value and parameters may be declared as optional to indicate that a program can leave their values
unset. Parameters not declared as optional are known as _required_ parameters; a program must supply legal values for
all required parameters. In the discussion below, we use _parameter_ to refer to input parameters, output parameters,
and return values.

A unique, non-negative integer _tag_ must be assigned to each optional parameter:

```slice
optional(3) bool example(optional(2) string name, out optional(1) int value);
```

The scope of a tag is limited to its operation and has no effect on other operations.

{% callout type="warning" %}

You can mark any parameter as optional, except if the parameter’s type is a class type or a constructed type that holds
a class type: optional and class are incompatible.

{% /callout %}

Optional fields and required fields can appear in any order in your class definition. You can also assign tags in any
order.

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

# Overloading Operations

Slice does not support any form of overloading of operations. For example:

```slice
interface CircadianRhythm
{
    void modify(TimeOfDay startTime, TimeOfDay endTime);

    void modify(    TimeOfDay startTime,        // Error
                    TimeOfDay endTime,
                out timeOfDay prevStartTime,
                out TimeOfDay prevEndTime);
}
```

Operations in the same interface must have different names, regardless of what type and number of parameters they have.
This restriction exists because overloaded functions cannot sensibly be mapped to languages without built-in support for
overloading.

{% callout type="info" %}

Name mangling is not an option in this case: while it works fine for compilers, it is unacceptable to humans.

{% /callout %}

# Idempotent Operations

Some operations, such as `getTime` in the `Clock` interface, do not modify the state of the object they operate on. They
are the conceptual equivalent of C++ `const` member functions. Similarly, `setTime` does modify the state of the object,
but is idempotent. You can indicate this in Slice as follows:

```slice
interface Clock
{
    idempotent TimeOfDay getTime();
    idempotent void setTime(TimeOfDay time);
}
```

This marks the `getTime` and `setTime` operations as idempotent. An operation is idempotent if two successive
invocations of the operation have the same effect as a single invocation. For example, `x = 1;` is an idempotent
operation because it does not matter whether it is executed once or twice — either way, `x` ends up with the value 1. On
the other hand, `x += 1;` is not an idempotent operation because executing it twice results in a different value for `x`
than executing it once. Obviously, any read-only operation is idempotent.

The `idempotent` keyword is useful because it allows the Ice runtime to be more aggressive when performing
[automatic retries](../automatic-retries) to recover from errors. Specifically, Ice guarantees _at-most-once_ semantics
for operation invocations:

- For normal (not idempotent) operations, the Ice runtime has to be conservative about how it deals with errors. For
  example, if a client sends an operation invocation to a server and then loses connectivity, there is no way for the
  client-side run time to find out whether the request it sent actually made it to the server. This means that the
  runtime cannot attempt to recover from the error by re-establishing a connection and sending the request a second time
  because that could cause the operation to be invoked a second time and violate at-most-once semantics; the runtime has
  no option but to report the error to the application.
- For `idempotent` operations, on the other hand, the client-side runtime can attempt to re-establish a connection to
  the server and safely send the failed request a second time. If the server can be reached on the second attempt,
  everything is fine and the application never notices the (temporary) failure. Only if the second attempt fails need
  the runtime report the error back to the application. (The number of retries can be increased with an Ice
  configuration parameter.)

## Language Mapping

{% language-section name="language-mapping" /%}
