---
title: Per-Proxy Request Contexts
sidebarLabel: Per-Proxy
---

Each proxy stores a request context, empty by default. Ice sends this per-proxy context with each invocation made
through the proxy, unless the invocation has an [explicit context](../explicit-request-contexts).

`ice_context` returns a new proxy that stores the given context, and `ice_getContext` returns the proxy's context:

{% language-section name="mapping" /%}

The per-proxy context is a local setting of the proxy: a stringified proxy cannot carry one, and Ice does not marshal it
when it sends the proxy to another application.

## Configuring a Per-Proxy Request Context with Properties

When you create a proxy with `propertyToProxy`, the `Context` properties of the proxy property set its per-proxy
context:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
Greeter.Proxy.Context.language=es
```

Each `name.Context.key=value` property adds the entry `key` with the value `value`. To change this context, call
`ice_context` with an updated copy of the dictionary that `ice_getContext` returns.

## See Also

- [Proxy Properties](../../../../property-reference/proxy-properties)
