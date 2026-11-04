---
title: Syntax for Stringified Proxies
sidebarLabel: Proxy String Syntax
---

## Synopsis

`identity [options]`

`identity [options] @ adapter_id`

`identity [options] : endpoint[:endpoint...]`

## Description

A stringified proxy consists of an identity, optional proxy options, and optional addressing information. The three
forms of the synopsis represent:

- a [well-known proxy](../proxy-endpoints#well-known-proxy), with an identity and no addressing information
- a [proxy with an adapter ID](../proxy-endpoints#proxy-with-an-adapter-id)
- a direct proxy, with an identity and one or more endpoints

The first two are indirect proxies, which Ice resolves with the [locator](../../locators).

White space separates the components of a stringified proxy. The proxy options follow the identity and precede the `@`
or `:` separator.

## Options

| Option        | Description                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `-f facet`    | Sets the [facet](../../facets) of the target object.                                                                                                                                                                           |
| `-e encoding` | Sets the encoding version that invocations on this proxy use to marshal parameters. The default is the value of [Ice.Default.EncodingVersion](../../../property-reference/ice-default-properties#ice.default.encodingversion). |
| `-p protocol` | Sets the Ice protocol version of the requests sent with this proxy. The default is `1.0`, the only version Ice supports.                                                                                                       |
| `-t`          | Configures the proxy for twoway invocations (default).                                                                                                                                                                         |
| `-o`          | Configures the proxy for oneway invocations.                                                                                                                                                                                   |
| `-O`          | Configures the proxy for batch oneway invocations.                                                                                                                                                                             |
| `-d`          | Configures the proxy for datagram invocations.                                                                                                                                                                                 |
| `-D`          | Configures the proxy for batch datagram invocations.                                                                                                                                                                           |

Use at most one of `-t`, `-o`, `-O`, `-d`, and `-D`.

## Identity, Facet, and Adapter ID

The identity has the form `[category/]name`, where `category` and `name` are strings encoded as described in
[Object Identity](../../object-identity): a slash (`/`) in `category` or `name` is escaped as `\/`. The facet and the
adapter ID are strings encoded like a [Slice string literal](../../../slice/constants-and-literals).

Enclose the identity or the facet in quotes if it contains white space, `:`, or `@`, and the adapter ID if it contains
white space. Double quotes let the value contain a single quote, and single quotes let it contain a double quote. For
example:

```text
"store/item one" -f 'admin:read' : tcp -h localhost -p 4061
store/item @ "Adapter A"
```

## Endpoints

The endpoints of a direct proxy are separated with a colon (`:`) and formatted as described in
[Endpoint Syntax](../../endpoint-syntax).

## See Also

- [Endpoint Syntax](../../endpoint-syntax)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
