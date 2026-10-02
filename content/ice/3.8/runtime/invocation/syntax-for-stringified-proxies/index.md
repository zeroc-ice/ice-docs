---
title: Syntax for Stringified Proxies
---

## Synopsis

`identity -f facet -e encoding -p protocol -t -o -O -d -D -s`

`identity -f facet -e encoding -p protocol -t -o -O -d -D -s @ adapter_id`

`identity -f facet -e encoding -p protocol -t -o -O -d -D -s : endpoints`

## Description

A stringified proxy consists of an identity, proxy options, and an optional object adapter identifier or endpoint list.
The proxy options follow the identity and precede the `@` or `:` separator, and the object adapter identifier ends the
string. White space (the space, tab (`\t`), line feed (`\n`), and carriage return (`\r`) characters) act as token
delimiters; if a white space character appears as part of a component of a stringified proxy (such as the identity), it
must be quoted or escaped as described below.

A proxy containing an identity with no endpoints is a [well-known proxy](../well-known-proxy); a proxy with an identity
and an object adapter identifier represents an indirect proxy that will be resolved using the
[Ice locator](../locators).

The following options are available:

| `-f` `facet`  | Select a facet of the Ice object.                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-e encoding` | Specify the Ice encoding version to use when an invocation on this proxy marshals parameters.                                                             |
| `-p protocol` | Specify the Ice protocol version to use when sending a request with this proxy. Should never be specified since there is only one protocol version (1.0). |
| `-t`          | Configures the proxy for twoway invocations (default).                                                                                                    |
| `-o`          | Configures the proxy for oneway invocations.                                                                                                              |
| `-O`          | Configures the proxy for batch oneway invocations.                                                                                                        |
| `-d`          | Configures the proxy for datagram invocations.                                                                                                            |
| `-D`          | Configures the proxy for batch datagram invocations.                                                                                                      |
| `-s`          | For backwards compatibility. Has no effect.                                                                                                               |

The proxy options `-t`, `-o`, `-O`, `-d`, and `-D` are mutually exclusive.

The object identity `identity` is structured as `[category/]name`, where the `category` component and slash separator
are optional. If `identity` contains white space or either of the characters `:` or `@`, it must be enclosed in single
or double quotes. The `category` and `name` components are strings that are encoded as described in
[Object Identity](../object-identity), in particular, any occurrence of a slash (`/`) in `category` or `name` must be
escaped with a backslash (i.e., `\/`).

The `facet` argument of the `-f` option represents a [facet](../facets) name. If `facet` contains white space, it must
be enclosed in single or double quotes. A facet name is a string encoded like a
[Slice String Literal](../constants-and-literals).

Likewise, an object adapter identifier `adapter_id` is a string encoded like a
[Slice String Literal](../constants-and-literals). If `adapter_id` contains white space, it must be enclosed in single
or double quotes.

Single or double quotes can be used to prevent white space characters from being interpreted as delimiters. Double
quotes prevent interpretation of a single quote as an opening or closing quote, for example:

```text
"a string with a ' quote"
```

Single quotes prevent interpretation of a double quote as an opening or closing quote. For example:

```text
'a string with a " quote'
```

If `endpoints` are specified, they must be separated with a colon (`:`) and formatted as described in the
[endpoint syntax](../endpoint-syntax). The proxy keeps the endpoints in the order of the stringified proxy, and
`ice_getEndpoints` returns them in this order. This is not necessarily the order in which Ice attempts connections: with
the default `Random` endpoint selection type, Ice shuffles the endpoints each time the proxy needs a connection, as a
form of load balancing. You can change this default behavior using the properties
[Ice.Default.EndpointSelection](../ice-default-properties) and [_name_.EndpointSelection](../proxy-properties).

If an unknown option is specified, or the stringified proxy is malformed, the application receives a `ParseException`.
Likewise, if an endpoint is malformed, the application receives a `ParseException`.

Ice drops an endpoint whose transport is not registered with the communicator, such as a `bt` endpoint in a runtime
without IceBT, and logs a warning that lists the dropped endpoints when [Ice.Warn.Endpoints](../ice-warn-properties) is
greater than 0, which is the default. If Ice drops every endpoint of the stringified proxy, the application receives a
`ParseException`.

## See Also

- [Endpoint Syntax](../endpoint-syntax)
- [Ice.Default.*](../ice-default-properties)
