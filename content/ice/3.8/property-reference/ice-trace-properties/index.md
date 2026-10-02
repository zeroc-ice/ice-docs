---
title: Ice.Trace.*
---

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Trace.Admin.Logger

### Synopsis {% id="ice.trace.admin.logger-synopsis" %}

`Ice.Trace.Admin.Logger=num`

### Description {% id="ice.trace.admin.logger-description" %}

Controls the trace level for the
[Logger administrative facet](../../administration/administrative-facility/logger-facet).

| Value | Description                                                           |
| ----- | --------------------------------------------------------------------- |
| 0     | No trace (default).                                                   |
| 1     | Trace when a remote logger is attached or detached.                   |
| 2     | Like 1, but also trace the sending of log messages to remote loggers. |

## Ice.Trace.Admin.Properties

### Synopsis {% id="ice.trace.admin.properties-synopsis" %}

`Ice.Trace.Admin.Properties=num`

### Description {% id="ice.trace.admin.properties-description" %}

Controls the trace level for property updates made via the
[Properties facet](../../administration/administrative-facility/properties-facet):

| Value | Description                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------- |
| 0     | No property trace (default).                                                                         |
| 1     | Trace the names of added, changed, and removed properties.                                           |
| 2     | Like 1, plus new values for added and changed properties and previous values for changed properties. |

{% /iflang %}

## Ice.Trace.Dispatch

### Synopsis {% id="ice.trace.dispatch-synopsis" %}

`Ice.Trace.Dispatch=num`

### Description {% id="ice.trace.dispatch-description" %}

If `num` is greater than zero, the logger middleware traces dispatches that complete successfully or return a user
exception, and logs warnings for failed dispatches. In this case, [Ice.Warn.Dispatch](../ice-warn-properties) does not
control the middleware's logging. Otherwise, `Ice.Warn.Dispatch` selects which dispatch failures produce warnings. The
default value is 0.

## Ice.Trace.Locator

### Synopsis {% id="ice.trace.locator-synopsis" %}

`Ice.Trace.Locator=num`

### Description {% id="ice.trace.locator-description" %}

The Ice runtime makes [locator](../../runtime/locators) requests to resolve the endpoints of object adapters and
well-known objects. Requests on the locator registry are used to update object adapter endpoints and set the server
process proxy. This property controls the trace level for the Ice runtime's interactions with the locator:

| Value | Description                                                     |
| ----- | --------------------------------------------------------------- |
| 0     | No locator trace (default).                                     |
| 1     | Trace Ice locator and locator registry requests.                |
| 2     | Like 1, but also trace the removal of endpoints from the cache. |

## Ice.Trace.Network

### Synopsis {% id="ice.trace.network-synopsis" %}

`Ice.Trace.Network=num`

### Description {% id="ice.trace.network-description" %}

Controls the trace level for low-level network activities such as connection establishment and read/write operations:

| Value | Description                                                                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No network trace (default).                                                                                                                                          |
| 1     | Trace established and closed connections, listener activity, and an object adapter's [published endpoints](../../runtime/dispatch/object-adapter-endpoints).         |
| 2     | Like 1, plus connection attempts and failures, endpoint-resolution failures, bind and accept attempts, rejected connections, and adapters created without endpoints. |
| 3     | Like 2, plus the number of bytes sent and received in each transport read or write.                                                                                  |

## Ice.Trace.Protocol

### Synopsis {% id="ice.trace.protocol-synopsis" %}

`Ice.Trace.Protocol=num`

### Description {% id="ice.trace.protocol-description" %}

Controls the trace level for Ice [protocol messages](../../protocol/protocol-messages):

| Value | Description                  |
| ----- | ---------------------------- |
| 0     | No protocol trace (default). |
| 1     | Trace Ice protocol messages. |

## Ice.Trace.Retry

### Synopsis {% id="ice.trace.retry-synopsis" %}

`Ice.Trace.Retry=num`

### Description {% id="ice.trace.retry-description" %}

Ice supports [automatic retries](../../runtime/invocation/automatic-retries) in case of a request failure. This property
controls the trace level for retry attempts:

| Value | Description                                                                                 |
| ----- | ------------------------------------------------------------------------------------------- |
| 0     | No request retry trace (default).                                                           |
| 1     | Trace Ice operation call retries.                                                           |
| 2     | Also trace Ice retry for connection establishment failures on Ice locator cached endpoints. |

## Ice.Trace.Slicing

### Synopsis {% id="ice.trace.slicing-synopsis" %}

`Ice.Trace.Slicing=num`

### Description {% id="ice.trace.slicing-description" %}

The Ice data encoding for [exceptions](../../encoding/data-encoding-for-exceptions) and
[classes](../../encoding/data-encoding-for-classes) enables a receiver to slice an unknown exception or class type to a
known type. This property controls the trace level for slicing activities:

| Value | Description                                                                                |
| ----- | ------------------------------------------------------------------------------------------ |
| 0     | No trace of slicing activity (default).                                                    |
| 1     | Trace all exception and class types that are unknown to the receiver and therefore sliced. |

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Trace.ThreadPool

### Synopsis {% id="ice.trace.threadpool-synopsis" %}

`Ice.Trace.ThreadPool=num`

### Description {% id="ice.trace.threadpool-description" %}

Controls the trace level for the Ice [thread pool](../../runtime/threading-model):

| Value | Description                                                 |
| ----- | ----------------------------------------------------------- |
| 0     | No trace of thread pool activity (default).                 |
| 1     | Trace the creation, growing, and shrinking of thread pools. |

{% /iflang %}
