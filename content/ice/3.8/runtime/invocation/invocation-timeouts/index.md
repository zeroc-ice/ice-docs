---
title: Invocation Timeouts
sidebarLabel: Timeouts
---

An invocation timeout limits how long Ice waits for an invocation to complete. When the timeout expires, the invocation
fails with `InvocationTimeoutException`.

Ice starts the timer once it has marshaled the request parameters, before it obtains a connection, cached or newly
established. For a twoway invocation, it stops the timer when it receives the reply, before it unmarshals the reply. For
a oneway invocation, it stops the timer once it has sent the request. The timeout applies to the invocation as a whole:
Ice does not restart the timer when it [retries](../automatic-retries) the invocation.

## Configuring Invocation Timeouts

[Ice.Default.InvocationTimeout](../../../property-reference/ice-default-properties#ice.default.invocationtimeout) sets
the default invocation timeout of proxies, in milliseconds. Its default value, `-1`, means no timeout.

The [InvocationTimeout](../../../property-reference/proxy-properties#name.invocationtimeout) proxy property sets the
timeout of the proxy that [propertyToProxy](../creating-proxies) creates:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
Greeter.Proxy.InvocationTimeout=2500
```

The `ice_invocationTimeout` proxy factory method returns a new proxy with the given timeout:

{% language-section name="configuring-invocation-timeouts-for-proxies" /%}

## When an Invocation Times Out

An invocation timeout affects only the client: Ice does not notify the server, which can still be dispatching the
request, and Ice ignores the reply if the server sends one. Ice does not [retry](../automatic-retries) an invocation
that times out.

## See Also

- [Proxy Properties](../../../property-reference/proxy-properties)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Obtaining Proxies](../creating-proxies)
