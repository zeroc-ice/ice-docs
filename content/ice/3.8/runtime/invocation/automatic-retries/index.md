---
title: Automatic Retries
---

Ice can automatically retry a failed proxy invocation. To preserve
[at-most-once semantics](../../../slice/operations#idempotent-operations), Ice retries an invocation of a non-idempotent
operation only when it knows that the server did not dispatch the request. For an operation declared `idempotent`, Ice
also retries when the server may have dispatched the request.

For example, retrying a failed invocation of the `withdraw` operation of the
[`Account` interface](#automatic-retries-for-idempotent-operations) could withdraw the amount twice, if the server
dispatched the original request but its reply never reached the client.

## Automatic Retries for Request Failures

An invocation fails when Ice cannot establish a connection, send the request, or receive the reply, or when the server
reports a [dispatch exception](../../local-and-dispatch-exceptions#dispatch-exceptions). Ice does not retry an
invocation that completes with a user exception.

Ice answers three questions to decide whether to retry a failed invocation.

### What Caused the Failure?

Ice never retries an invocation that fails:

- with `MarshalException`
- because its [invocation timeout](../invocation-timeouts) expired or it was canceled{% iflang langs="java" %}, or
  because its thread was interrupted{% /iflang %}
- because its communicator or object adapter was destroyed or deactivated
- because the application closed the connection
- with `FacetNotExistException` or `OperationNotExistException`
- with `ObjectNotExistException`, unless the proxy is [indirect](../../../basics/terminology), since the Ice object may
  have moved to another server; the server found no servant for the request, so Ice retries it even for an operation
  that is not idempotent

Nor does Ice retry an invocation on a fixed proxy, or the flush of the requests queued on a
[batch proxy](../invocation-mode/batched-invocations).

Any other local exception remains a candidate for retry, including any other
[dispatch exception](../../local-and-dispatch-exceptions#dispatch-exceptions), such as `UnknownException`,
`UnknownLocalException` or `UnknownUserException`.

### Could the Server Have Dispatched the Request?

Ice treats a request as dispatched as soon as it has written the entire protocol message to the client's local transport
buffers. A request that failed before this point was not dispatched.

When the Ice runtime in the server closes a connection gracefully, for example because the server is shutting down, it
first finishes the dispatches in progress and replies to them, and does not dispatch the requests it receives after
that. Ice in the client then retries the requests on this connection that are still waiting for a reply.

### Is the Operation Idempotent?

When the server may have dispatched the request, Ice retries it only if the operation is
[idempotent](#automatic-retries-for-idempotent-operations).

When Ice does not retry a failed invocation, or when its last retry fails, the invocation fails with the exception of
its last attempt.

## Automatic Retries for Idempotent Operations

Annotating a Slice operation with the [idempotent](../../../slice/operations) keyword notifies Ice that it can safely
violate at-most-once semantics:

```slice
interface Account
{
    long withdraw(long amount);
    idempotent long getBalance();
    idempotent void changeAddress(string newAddress);
}
```

Although `withdraw` clearly requires the stricter treatment, there is no harm in automatically retrying the `getBalance`
operation even if the server executes the same request more than once.

In general, "read-only" operations are good candidates for the `idempotent` keyword whereas many mutating operations are
not. However, the risk of duplicate requests is acceptable even for some kinds of mutating operations: `changeAddress`
is idempotent because executing the request twice has the same effect as executing it only once.

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
logic and therefore require immediate notification when a failure occurs. A first value of `-1` disables retries:

```config
Ice.RetryIntervals=-1
```

When the server closes the connection gracefully, Ice retries the invocation once more even if it has reached this
limit, including when retries are disabled with `-1`.

### Retry Tracing

Set [Ice.Trace.Retry](../../../property-reference/ice-trace-properties#ice.trace.retry) to `1` to trace retries:

```config
Ice.Trace.Retry=1
```

Ice then logs each retry, with the exception that caused it, and logs when an invocation reaches the retry limit. Set
`Ice.Trace.Retry` to `2` to also trace the failed connection attempts to endpoints from the locator cache, after which
Ice asks the locator for the endpoints again.

## See Also

- [Terminology](../../../basics/terminology)
- [Operations](../../../slice/operations)
- [Invocation Timeouts](../invocation-timeouts)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Getting Started with Glacier2](../../../services/glacier2/getting-started-with-glacier2)
