---
title: Automatic Retries
---

Ice may automatically retry a proxy invocation after a failure. This is a powerful feature that, when used in the proper
situations, can significantly improve the robustness of your application without any additional programming effort. The
retry facility is governed by one overriding principle: always respect at-most-once semantics.
[At-most-once semantics](../../../slice/operations#idempotent-operations) dictate that the Ice runtime in the client
must never retry a failed proxy invocation unless Ice guarantees that the server has not already received the request,
or unless the application declares that it is safe for Ice to violate at-most-once semantics for the request.

To understand the importance of obeying at-most-once semantics, consider the following Slice definition:

```slice
interface Account
{
    long withdraw(long amount);
}
```

The `withdraw` operation removes funds from an account. If an invocation of `withdraw` fails, automatically retrying the
request introduces the risk of a duplicate withdrawal unless Ice is absolutely sure that the server has not already
executed the request.

This page examines automatic retries in more detail.

## Automatic Retries for Request Failures

Ice considers a request to have failed if any of the following conditions are true:

- A connection could not be established
- A connection was lost before the reply was received
- An exception occurred while sending the request or receiving the reply
- The server reported a [dispatch exception](../../local-and-dispatch-exceptions#dispatch-exceptions)

{% callout type="note" %}

Ice considers an invocation that results in a user exception to be successful and therefore excludes it from
consideration for automatic retries.

{% /callout %}

Ice must determine the answers to several questions to decide whether to retry a failed request:

**1. What kind of error caused the request to fail?**

Ice does not retry a request when the same error would occur again. It never retries a request that failed:

- with `MarshalException`, a problem while marshaling the request or unmarshaling the reply
- because the invocation timed out or was canceled{% iflang langs="java" %}, or because its thread was
  interrupted{% /iflang %}
- because its communicator or object adapter was destroyed or deactivated
- because the application closed the connection
- with `FacetNotExistException` or `OperationNotExistException`, which usually mean the client and the server use
  incompatible Slice definitions, or the client calls the wrong object
- with `ObjectNotExistException`, unless the proxy is [indirect](../../../basics/terminology), since the Ice object may
  have moved to another server

Nor does Ice retry an invocation on a fixed proxy, or the flush of the requests queued on a
[batch proxy](../invocation-mode/batched-invocations).

Any other local exception remains a candidate for retry, including any other
[dispatch exception](../../local-and-dispatch-exceptions#dispatch-exceptions), such as `UnknownException`,
`UnknownLocalException` or `UnknownUserException`.

**2. When did the error occur?**

If the error is still a candidate for retry, Ice needs to know whether the server has received the request. Naturally,
the Ice runtime in the client cannot possibly know that information until the server confirms it by sending a reply.
However, to be conservative Ice assumes that the server has received the request as soon as Ice has written the _entire_
protocol message to the client's local transport buffers. If the error occurred before Ice managed to write the complete
message, retrying the request would not violate at-most-once semantics.

The Ice runtime in the server also has the ability to notify the client that a request was not dispatched and therefore
that it is safe for the Ice runtime in the client to retry the request without violating at-most-once semantics. For
example, this situation can occur when the server is shutting down while there are pending requests that have yet to be
executed. Sending this notification allows a client to transparently fail over to another server.

**3. Does the application require strict adherence to at-most-once semantics for this request?**

An application can grant permission for Ice to violate at-most-once semantics for certain Slice operations by marking
them as _idempotent_, causing Ice to retry a request that otherwise would be ineligible because the server has already
received it. We discuss idempotent operations in more detail [below](#automatic-retries-for-idempotent-operations).

If Ice determines that an invocation cannot be retried, it throws the exception that caused the request failure to the
application. On the other hand, if Ice does retry the invocation and the subsequent retries also fail, Ice throws the
_last_ exception to the application. For example, if the first attempt fails with `ConnectionRefusedException` and the
retry fails with `ConnectTimeoutException`, the invocation throws `ConnectTimeoutException` to the application.

## Automatic Retries for Idempotent Operations

Annotating a Slice operation with the [idempotent](../../../slice/operations) keyword notifies Ice that it can safely
violate at-most-once semantics:

```slice
interface Account
{
    long withdraw(long amount);
    idempotent long getBalance();
}
```

Although `withdraw` clearly requires the stricter treatment, there is no harm in automatically retrying the `getBalance`
operation even if the server executes the same request more than once.

In general, "read-only" operations are good candidates for the `idempotent` keyword whereas many mutating operations are
not. However, the risk of duplicate requests is acceptable even for some kinds of mutating operations:

```slice
interface Account
{
    long withdraw(long amount);
    idempotent long getBalance();
    idempotent void changeAddress(string newAddress);
}
```

Here we have marked `changeAddress` as idempotent because executing the request twice has the same effect as executing
it only once.

The benefit of the `idempotent` keyword and the associated relaxation of retry semantics is that an invocation that
otherwise might have thrown an exception has at least one more chance to succeed. Furthermore, the application does not
need to initiate the retry, and in fact the retry activities are completely transparent: if a subsequent retry succeeds,
the application receives its results as if nothing went wrong. The invocation only throws an exception once Ice has
reached its configured retry limits.

## Configuring Automatic Retries

### Retry Intervals

The [Ice.RetryIntervals](../../../property-reference/ice-properties#ice.retryintervals) property configures the retry
behavior for a communicator and affects invocations on every proxy created by that communicator. The value of this
property is a list of integers, separated by commas or whitespace. The number of integers determines how many retry
attempts Ice makes, and the value of each entry represents a delay in milliseconds. If this property is not defined, the
default behavior is to retry once immediately after the first failure, which is equivalent to the following property
definition:

```config
Ice.RetryIntervals=0
```

You may want a more elaborate configuration for your application, such as a gradual increase in the delay between
retries:

```config
Ice.RetryIntervals=0 100 500 1000
```

With this setting, Ice retries immediately as in the default case. If the first retry attempt also fails, Ice waits 100
milliseconds before trying again, then 500 milliseconds, and finally tries one more time after waiting one second.

In some situations you may need to disable retries completely. For example, an application might implement its own retry
logic and therefore require immediate notification when a failure occurs. A first value of `-1` disables the retries
governed by this property:

```config
Ice.RetryIntervals=-1
```

### Retry Logging

To monitor Ice's retry activities, configure your program with the property
[Ice.Trace.Retry](../../../property-reference/ice-trace-properties#ice.trace.retry) set to a non-zero value:

```config
Ice.Trace.Retry=1
```

When retry tracing is enabled, Ice logs a message each time it attempts a retry; the log message includes a description
of the exception that prompted the retry. Ice also logs a message when it reaches the retry limit.

You can configure Ice to log even more information about retries by setting the property to `2`:

```config
Ice.Trace.Retry=2
```

This setting prompts Ice to include additional details about connections and endpoints.

## See Also

- [Terminology](../../../basics/terminology)
- [Operations](../../../slice/operations)
- [Invocation Timeouts](../invocation-timeouts)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Getting Started with Glacier2](../../../services/glacier2/getting-started-with-glacier2)
