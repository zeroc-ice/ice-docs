---
title: Per-Proxy Request Contexts
---

Instead of passing a context [explicitly](../explicit-request-contexts) with an invocation, you can also use a
_per-proxy context_. Per-proxy contexts allow you to set a context on a particular proxy once and, thereafter, whenever
you use that proxy to invoke an operation, the previously-set context is sent with each invocation.

## Configuring a Per-Proxy Request Context Programmatically

The proxy methods `ice_context` and `ice_getContext` set and retrieve the context, respectively. `ice_context` creates a
new proxy that stores the given context. Calling `ice_getContext` returns the stored context, or an empty dictionary if
no per-proxy context has been configured for the proxy.

{% language-section name="mapping" /%}

This example shows how to configure a request context on a proxy. Once set, the request context is automatically
included with every request sent through that proxy. An explicit request context provided at the time of an invocation
always takes precedence over the proxy’s configured context.

## Configuring a Per-Proxy Request Context Using Properties

You can also configure a context with proxy properties when you use the communicator method `propertyToProxy`.

We can configure a context for this proxy using the following properties:

```config
GreeterProxy=person:greeter:tcp -h localhost -p 4061
GreeterProxy.Context.language=es
```

The Context property has the form `name.Context.key=value`, where `key` and `value` can be any
[legal property symbols](../../../properties-and-configuration/properties-overview).

The proxy returned by `propertyToProxy` already contains the context key/value pairs specified in the configuration
properties. To make any modifications to the context at run time, you'll need to retrieve the proxy's context dictionary
using `ice_getContext`, modify the dictionary as necessary, and finally obtain a new proxy by calling `ice_context`, as
we described above.

## See Also

- [Explicit Request Contexts](../explicit-request-contexts)
- [Proxy Properties](../../../../property-reference/proxy-properties)
