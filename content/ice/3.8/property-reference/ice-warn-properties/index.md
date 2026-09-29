---
title: Ice.Warn.*
---

{% language-section name="lang-1" /%}

## Ice.Warn.Connections

### Synopsis {% id="ice.warn.connections-synopsis" %}

`Ice.Warn.Connections=num`

### Description {% id="ice.warn.connections-description" %}

If `num` is set to a value larger than 0, the Ice runtime logs warnings for certain exceptional conditions in
connections. The default value is 0.

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

This property is ignored when [Ice.Trace.Dispatch](../ice-trace-properties) has a value larger than 0.

Otherwise, if `num` is set to a value larger than 0, the logger middleware logs warning messages when exceptions are
thrown during dispatches.

The default value is `1`.

Warning levels:

| 0   | Logs no warnings.                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Logs warnings for: all exceptions except dispatch exceptions, and the 3 Unknown exceptions (`UnknownException`, `UnknownLocalException`, `UnknownUserException`) |
| 2   | Like 1, but also logs warnings for dispatch exceptions such as `ObjectNotExistException`, `FacetNotExistException`, and `OperationNotExistException`.            |

## Ice.Warn.Endpoints

### Synopsis {% id="ice.warn.endpoints-synopsis" %}

`Ice.Warn.Endpoints=num`

### Description {% id="ice.warn.endpoints-description" %}

If `num` is set to a value larger than 0, the Ice runtime logs a warning when a stringified proxy contains an endpoint
that cannot be parsed. The default value is 1.

{% language-section name="lang-2" /%}

## Ice.Warn.UnusedProperties

### Synopsis {% id="ice.warn.unusedproperties-synopsis" %}

`Ice.Warn.UnusedProperties=num`

### Description {% id="ice.warn.unusedproperties-description" %}

If `num` is set to a value larger than 0, the Ice runtime logs a warning during communicator destruction if some
properties were set but not read. This warning is useful for detecting mis-spelled properties, like if you wrote
`Filesystem.MaxFilSize` instead of `FileSystem.MaxFileSize`. The default value is 0.
