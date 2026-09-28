---
title: Ice.Warn.*
---

{% language-section name="lang-1" /%}

## Ice.Warn.Connections

### Synopsis {% id="ice.warn.connections-synopsis" %}

`Ice.Warn.Connections=num`

### Description {% id="ice.warn.connections-description" %}

A positive value enables warnings for unexpected exceptions on connections that have completed protocol validation,
including connection loss before closing. Ice suppresses warnings for normal connection closure and communicator or
object adapter shutdown. The default value is 0.

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

This setting also enables warnings for errors while accepting connections, exceptions while processing datagrams, and
close-connection messages received over a datagram connection. Warnings about oversized datagrams are controlled
separately by [Ice.Warn.Datagrams](../ice-warn-properties#ice.warn.datagrams).

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Warn.Datagrams

### Synopsis {% id="ice.warn.datagrams-synopsis" %}

`Ice.Warn.Datagrams=num`

### Description {% id="ice.warn.datagrams-description" %}

If `num` is set to a value larger than 0, a server logs a warning message if it receives a datagram that exceeds the
server's receive buffer size. (Note that this condition is not detected by all UDP implementations — some
implementations silently drop received datagrams that are too large.) The default value is 0.

{% /iflang %}

## Ice.Warn.Dispatch

### Synopsis {% id="ice.warn.dispatch-synopsis" %}

`Ice.Warn.Dispatch=num`

### Description {% id="ice.warn.dispatch-description" %}

When [Ice.Trace.Dispatch](../ice-trace-properties) is 0 or less, this property controls warnings from the logger
middleware. The default value is 1.

| Value | Description                                                                                                                                                                                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No warnings from the logger middleware.                                                                                                                                                                                            |
| 1     | Warn for `UnknownException`, `UnknownLocalException`, and `UnknownUserException`, other local exceptions except `DispatchException`, and non-Ice exceptions. Also warn for responses with one of the three Unknown reply statuses. |
| 2     | Like 1, plus other instances of `DispatchException`, such as `ObjectNotExistException`, `FacetNotExistException`, and `OperationNotExistException`, and other failure reply statuses.                                              |

User exceptions and responses with the `UserException` reply status produce no middleware warning.

A positive `Ice.Trace.Dispatch` value makes the middleware trace successful dispatches and user exceptions, and warn for
all dispatch failures regardless of this property's value. Ice installs the middleware when either tracing or dispatch
warnings are enabled.

{% iflang langs="python" %}

A positive `Ice.Warn.Dispatch` value also enables warnings for invalid return values from `ServantLocator.locate`. This
check is separate from the logger middleware and still uses `Ice.Warn.Dispatch` when dispatch tracing is enabled.

{% /iflang %}

## Ice.Warn.Endpoints

### Synopsis {% id="ice.warn.endpoints-synopsis" %}

`Ice.Warn.Endpoints=num`

### Description {% id="ice.warn.endpoints-description" %}

If `num` is greater than 0, Ice logs a warning when a stringified proxy contains both endpoints with known transports
and endpoints with unknown transports. Ice ignores the unknown endpoints and uses the recognized ones. The default value
is 1.

If all endpoints in a proxy string use unknown transports, Ice throws `ParseException` regardless of this setting.
Invalid syntax for a recognized transport also causes parsing to fail.

{% language-section name="lang-2" /%}

## Ice.Warn.UnusedProperties

### Synopsis {% id="ice.warn.unusedproperties-synopsis" %}

`Ice.Warn.UnusedProperties=num`

### Description {% id="ice.warn.unusedproperties-description" %}

If `num` is set to a value larger than 0, the Ice runtime logs a warning during communicator destruction if some
properties were set but not read. This warning is useful for detecting mis-spelled properties, like if you wrote
`Filesystem.MaxFilSize` instead of `FileSystem.MaxFileSize`. The default value is 0.
