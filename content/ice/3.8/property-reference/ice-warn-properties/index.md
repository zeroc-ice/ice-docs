---
title: Ice.Warn.*
---

{% language-section name="ice.warn.connections" /%}

## Ice.Warn.Connections

{% property-synopsis %}

`Ice.Warn.Connections=num`

{% /property-synopsis %}

{% property-description %}

A positive value enables warnings when an error closes an established connection, such as a lost connection. The default
value is `0`.

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

This property also enables warnings for errors while accepting connections and exceptions while processing datagrams.
Warnings about oversized datagrams are controlled separately by [Ice.Warn.Datagrams](#ice.warn.datagrams).

{% /iflang %}

{% /property-description %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Warn.Datagrams

{% property-synopsis %}

`Ice.Warn.Datagrams=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than `0`, a server logs a warning message if it receives a datagram that exceeds the
server's receive buffer size. (Note that this condition is not detected by all UDP implementations — some
implementations silently drop received datagrams that are too large.) The default value is `0`.

{% /property-description %}

{% /iflang %}

## Ice.Warn.Dispatch

{% property-synopsis %}

`Ice.Warn.Dispatch=num`

{% /property-synopsis %}

{% property-description %}

When [Ice.Trace.Dispatch](../ice-trace-properties) is `0`, this property controls warnings from the logger middleware.
The default value is `1`.

| Value | Description                                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`   | No warnings from the logger middleware.                                                                                                                                                   |
| `1`   | Warn when a dispatch fails with `UnknownException`, `UnknownLocalException`, or `UnknownUserException`, or with any exception that is neither a user exception nor a `DispatchException`. |
| `2`   | Like `1`, plus all other instances of `DispatchException`, such as `ObjectNotExistException`, `FacetNotExistException`, and `OperationNotExistException`.                                 |

{% /property-description %}

## Ice.Warn.Endpoints

{% property-synopsis %}

`Ice.Warn.Endpoints=num`

{% /property-synopsis %}

{% property-description %}

If `num` is greater than `0`, Ice logs a warning when it parses a stringified proxy that contains both endpoints with
known transports and endpoints with unknown transports. Ice ignores the unknown endpoints and uses the recognized ones.
The default value is `1`.

{% /property-description %}

{% language-section name="ice.warn.endpoints" /%}

## Ice.Warn.UnusedProperties

{% property-synopsis %}

`Ice.Warn.UnusedProperties=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than `0`, the Ice runtime logs a warning during communicator destruction if some
properties were set but not read. This warning is useful for detecting mis-spelled properties, like if you wrote
`Filesystem.MaxFilSize` instead of `FileSystem.MaxFileSize`. The default value is `0`.

{% /property-description %}
