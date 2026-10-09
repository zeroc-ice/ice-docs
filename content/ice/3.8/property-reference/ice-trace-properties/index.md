---
title: Ice.Trace.*
---

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Trace.Admin.Logger

{% property-synopsis %}

`Ice.Trace.Admin.Logger=num`

{% /property-synopsis %}

{% property-description %}

Controls the trace level for the
[Logger administrative facet](../../administration/administrative-facility/logger-facet).

| Value | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| `0`   | No trace (default).                                                     |
| `1`   | Trace when a remote logger is attached or detached.                     |
| `2`   | Like `1`, but also trace the sending of log messages to remote loggers. |

{% /property-description %}

## Ice.Trace.Admin.Properties

{% property-synopsis %}

`Ice.Trace.Admin.Properties=num`

{% /property-synopsis %}

{% property-description %}

Controls the trace level for property updates made via the
[Properties facet](../../administration/administrative-facility/properties-facet):

| Value | Description                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------ |
| `0`   | No property trace (default).                                                                           |
| `1`   | Trace the names of added, changed, and removed properties.                                             |
| `2`   | Like `1`, plus new values for added and changed properties and previous values for changed properties. |

{% /property-description %}

{% /iflang %}

## Ice.Trace.Dispatch

{% property-synopsis %}

`Ice.Trace.Dispatch=num`

{% /property-synopsis %}

{% property-description %}

If `num` is greater than `0`, the logger middleware traces dispatches that complete successfully or return a user
exception, and logs warnings for failed dispatches. In this case, [Ice.Warn.Dispatch](../ice-warn-properties) does not
control the middleware's logging. Otherwise, `Ice.Warn.Dispatch` selects which dispatch failures produce warnings. The
default value is `0`.

{% /property-description %}

## Ice.Trace.Locator

{% property-synopsis %}

`Ice.Trace.Locator=num`

{% /property-synopsis %}

{% property-description %}

The Ice runtime makes [locator](../../runtime/locators) requests to resolve the endpoints of object adapters and
well-known objects. Requests on the locator registry are used to update object adapter endpoints and set the server
process proxy. This property controls the trace level for the Ice runtime's interactions with the locator:

| Value | Description                                                       |
| ----- | ----------------------------------------------------------------- |
| `0`   | No locator trace (default).                                       |
| `1`   | Trace Ice locator and locator registry requests.                  |
| `2`   | Like `1`, but also trace the removal of endpoints from the cache. |

{% /property-description %}

## Ice.Trace.Network

{% property-synopsis %}

`Ice.Trace.Network=num`

{% /property-synopsis %}

{% property-description %}

Controls the trace level for low-level network activities such as connection establishment and read/write operations:

| Value | Description                                                                                                                                                            |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`   | No network trace (default).                                                                                                                                            |
| `1`   | Trace established and closed connections, listener activity, and an object adapter's [published endpoints](../../runtime/dispatch/object-adapter-endpoints).           |
| `2`   | Like `1`, plus connection attempts and failures, endpoint-resolution failures, bind and accept attempts, rejected connections, and adapters created without endpoints. |
| `3`   | Like `2`, plus the number of bytes sent and received in each transport read or write.                                                                                  |

{% /property-description %}

## Ice.Trace.Protocol

{% property-synopsis %}

`Ice.Trace.Protocol=num`

{% /property-synopsis %}

{% property-description %}

Controls the trace level for Ice [protocol messages](../../protocol/protocol-messages):

| Value | Description                  |
| ----- | ---------------------------- |
| `0`   | No protocol trace (default). |
| `1`   | Trace Ice protocol messages. |

{% /property-description %}

## Ice.Trace.Retry

{% property-synopsis %}

`Ice.Trace.Retry=num`

{% /property-synopsis %}

{% property-description %}

Ice supports [automatic retries](../../runtime/invocation/automatic-retries) in case of a request failure. This property
controls the trace level for retry attempts:

| Value | Description                                                                                 |
| ----- | ------------------------------------------------------------------------------------------- |
| `0`   | No request retry trace (default).                                                           |
| `1`   | Trace Ice operation call retries.                                                           |
| `2`   | Also trace Ice retry for connection establishment failures on Ice locator cached endpoints. |

{% /property-description %}

## Ice.Trace.Slicing

{% property-synopsis %}

`Ice.Trace.Slicing=num`

{% /property-synopsis %}

{% property-description %}

The Ice data encoding for [exceptions](../../encoding/data-encoding-for-exceptions) and
[classes](../../encoding/data-encoding-for-classes) enables a receiver to slice an unknown exception or class type to a
known type. This property controls the trace level for slicing activities:

| Value | Description                                                                                |
| ----- | ------------------------------------------------------------------------------------------ |
| `0`   | No trace of slicing activity (default).                                                    |
| `1`   | Trace all exception and class types that are unknown to the receiver and therefore sliced. |

{% /property-description %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Trace.ThreadPool

{% property-synopsis %}

`Ice.Trace.ThreadPool=num`

{% /property-synopsis %}

{% property-description %}

Controls the trace level for the Ice [thread pool](../../runtime/threading-model):

| Value | Description                                                 |
| ----- | ----------------------------------------------------------- |
| `0`   | No trace of thread pool activity (default).                 |
| `1`   | Trace the creation, growing, and shrinking of thread pools. |

{% /property-description %}

{% /iflang %}
