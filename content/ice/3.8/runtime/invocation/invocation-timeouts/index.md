---
title: Invocation Timeouts
---

# Overview of Invocation Timeouts

Invocation timeouts let an application specify the maximum amount of time it's willing to wait for invocations to
complete. If the timeout expires, the application receives `InvocationTimeoutException` as the result of an invocation.
The proxy starts the timer for the invocation timeout after the marshaling of the request parameters and before its
starts any network activity (connection establishment and sending of the request over the network connection). For a
two-way invocation, it stops the timer as soon as the response is received from the server and before the response
payload is unmarshaled. For a one-way invocation, it stops the timer as soon as the request is sent.

# Configuring the Default Invocation Timeout

The property [Ice.Default.InvocationTimeout](../ice-default-properties) establishes the default invocation timeout value
for proxies. This property has a default value of `-1`, which means invocations do not time out by default.

Consider this setting:

```config
Ice.Default.InvocationTimeout=5000 # in milliseconds
```

This configuration causes all invocations to time out if they do not complete within five seconds. Generally speaking
however, it's unlikely that a single timeout value will be appropriate for all of the operations that an application
invokes. It's more common for applications to configure invocation timeouts on a per-proxy basis, as we describe in the
next section.

# Configuring Invocation Timeouts for Proxies

You have a couple of options for configuring the invocation timeout of a proxy:

- Use a proxy property
- Call `ice_invocationTimeout`

Assuming you've defined a configuration property containing a proxy that your application reads using
[propertyToProxy](../creating-proxies), you can configure an invocation timeout as follows:

```config
# Assumes the application calls propertyToProxy("GreeterProxy")
GreeterProxy=greeter:tcp -h localhost -p 4061
GreeterProxy.InvocationTimeout=2500  # milliseconds
```

The [InvocationTimeout](../proxy-properties) proxy property specifies the invocation timeout that will be used for all
invocations made via the proxy returned by `propertyToProxy`.

To configure an invocation timeout at runtime, use the `ice_invocationTimeout` proxy factory method to obtain a new
proxy with the desired timeout:

{% language-section name="lang-1" /%}

# Invocation Timeout Failures

An application that configures invocation timeouts must be prepared to catch `InvocationTimeoutException`:

{% language-section name="lang-2" /%}

The effects of an invocation timeout are limited to the client; no indication is sent to the server, which may still be
busy dispatching the request. The Ice runtime in the client ignores a response to this request if the server eventually
sends one.

{% callout type="info" %}

Ice does **not** perform [automatic retries](../automatic-retries) for invocation timeouts.

{% /callout %}

##### See Also

- [Proxy Properties](../proxy-properties)
- [Ice.Default.*](../ice-default-properties)
- [Obtaining Proxies](../creating-proxies)
