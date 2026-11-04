---
title: Automatic Retries
---

Ice can automatically retry a failed invocation. By default, Ice retries once, immediately;
[Ice.RetryIntervals](../../../property-reference/ice-properties#ice.retryintervals) sets how many times Ice retries and
after which delays. Ice retries an invocation only when it is safe to do so, as described below.

## Automatic Retries for Request Failures

An invocation fails when Ice cannot establish a connection, send the request, or receive the reply, or when the server
reports a [dispatch exception](../../local-and-dispatch-exceptions#dispatch-exceptions). Ice does not retry an
invocation that completes with a user exception.

Ice answers two questions to decide whether to retry a failed invocation.

### What Caused the Failure?

Ice retries an invocation that fails with a local exception, including a
[dispatch exception](../../local-and-dispatch-exceptions#dispatch-exceptions) such as `UnknownException`, except when:

- the exception is `MarshalException`, `FacetNotExistException`, or `OperationNotExistException`
- the exception is `ObjectNotExistException` and the proxy is direct
- the [invocation timeout](../invocation-timeouts) expired
- the invocation was canceled{% iflang langs="java" %}, including by interrupting its thread{% /iflang %}
- the communicator or the object adapter was destroyed or deactivated
- the application closed the connection

Ice does not retry a [batched invocation](../invocation-mode/batched-invocations) or an invocation on a fixed proxy.

### Could the Server Have Dispatched the Request?

When an invocation fails before Ice has written the entire request to the client's local transport buffers, the server
cannot have received the request, so retrying it is safe. Once the request is written, Ice assumes that the server may
have dispatched it.

When a server closes a connection gracefully, for example because it is shutting down, it completes the dispatches in
progress and does not dispatch the requests it still receives on this connection. Ice retries these invocations: the
server did not process their requests, so retrying them is safe.

{% callout type="note" %}

Ice retries an invocation that fails this way once more even when it has reached the limit set by
[Ice.RetryIntervals](#retry-intervals), including when retries are disabled with `-1`.

{% /callout %}

Ice also retries an invocation on an indirect proxy that fails with `ObjectNotExistException`, even when the operation
is not idempotent.

When Ice does not retry a failed invocation, or when its last retry fails, the invocation fails with the exception of
its last attempt.

## Automatic Retries for Idempotent Operations

By default, Ice provides [at-most-once semantics](../../../slice/operations#idempotent-operations): the server
dispatches a request at most once, so Ice does not retry an invocation when the server may have dispatched its request.
When an operation does not need at-most-once semantics, declare it `idempotent`: Ice then retries its invocations in
this case too. For example:

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
