---
id: converting-proxies-to-strings
title: Converting Proxies to Strings
---

This page describes how an application can *stringify* a proxy and create a property dictionary that captures all the proxy's properties.

# Stringifying a Proxy

{% language-section name="lang-1" /%}

# Proxy To Property

You can also perform a deeper proxy stringification by calling `proxyToProperty` on your communicator. For example:

{% language-section name="lang-2" /%}

The resulting map or dictionary holds all the [proxy properties](../creating-proxies) for the supplied proxy. The second parameter of `propertyToProxy` is the base name for the [properties](../properties-overview) in the returned map.

##### See Also

- [Obtaining Proxies](../creating-proxies)
- [Proxy and Endpoint Syntax](../endpoint-syntax)
- [Proxy Properties](../proxy-properties)
