---
title: Converting Proxies to Strings
---

This page describes how an application can _stringify_ a proxy and create a property dictionary that captures all the
proxy's properties.

## Stringifying a Proxy

{% language-section name="stringifying-a-proxy" /%}

## Proxy to Property

You can also perform a deeper proxy stringification by calling `proxyToProperty` on your communicator. For example:

{% language-section name="proxy-to-property" /%}

The resulting map or dictionary holds all the [proxy properties](../../../property-reference/proxy-properties) for the
supplied proxy. The second parameter of `proxyToProperty` is the base name for the
[properties](../../properties-and-configuration/properties-overview) in the returned map.

## See Also

- [Obtaining Proxies](../creating-proxies)
- [Proxy and Endpoint Syntax](../../endpoint-syntax)
- [Proxy Properties](../../../property-reference/proxy-properties)
