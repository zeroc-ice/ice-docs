---
title: Per-Proxy Request Contexts
sidebarLabel: Per-Proxy
---

A per-proxy context is a context stored in a proxy: Ice sends it with each invocation made through this proxy, unless
the invocation has an [explicit context](../explicit-request-contexts).

`ice_context` returns a new proxy that stores the given context, and `ice_getContext` returns the proxy's context, or an
empty dictionary when the proxy has none:

{% language-section name="mapping" /%}

The context stays in the process: Ice does not include it in a stringified proxy or in the properties that
`proxyToProperty` returns, and does not marshal it with the proxy.

## Configuring a Per-Proxy Request Context with Properties

The proxy that `propertyToProxy` creates also stores the context given by its `Context` properties:

```config
Greeter.Proxy=greeter:tcp -h localhost -p 4061
Greeter.Proxy.Context.language=es
```

Each `name.Context.key=value` property adds the entry `key` with the value `value`, where `key` and `value` are
[legal property symbols](../../../properties-and-configuration/properties-overview). To change this context, call
`ice_context` with an updated copy of the dictionary that `ice_getContext` returns.

## See Also

- [Proxy Properties](../../../../property-reference/proxy-properties)
