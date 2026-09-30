---
title: Ice.Trace.*
---

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Trace.Admin.Logger

### Synopsis

`Ice.Trace.Admin.Logger=num`

### Description

Controls the trace level for the [Logger administrative facet](../logger-facet).

| 0   | No trace (default).                                                   |
| --- | --------------------------------------------------------------------- |
| 1   | Trace when a remote logger is attached or detached.                   |
| 2   | Like 1, but also trace the sending of log messages to remote loggers. |

## Ice.Trace.Admin.Properties

### Synopsis

`Ice.Trace.Admin.Properties=num`

### Description

Controls the trace level for property updates made via the [Properties facet](../properties-facet):

| 0   | No property trace (default).                        |
| --- | --------------------------------------------------- |
| 1   | Trace property addition, modification, and removal. |

{% /iflang %}

## Ice.Trace.Dispatch

### Synopsis

`Ice.Trace.Dispatch=num`

### Description

If `num` is set to a value larger than zero, the logger middleware logs all dispatches and the value of
[Ice.Warn.Dispatch](../ice-warn-properties) is ignored. Otherwise, `Ice.Warn.Dispatch` controls the logger middleware
logging.

## Ice.Trace.Locator

### Synopsis

`Ice.Trace.Locator=num`

### Description

The Ice runtime makes [locator](../locators) requests to resolve the endpoints of object adapters and well-known
objects. Requests on the locator registry are used to update object adapter endpoints and set the server process proxy.
This property controls the trace level for the Ice runtime's interactions with the locator:

| 0   | No locator trace (default).                                     |
| --- | --------------------------------------------------------------- |
| 1   | Trace Ice locator and locator registry requests.                |
| 2   | Like 1, but also trace the removal of endpoints from the cache. |

## Ice.Trace.Network

### Synopsis

`Ice.Trace.Network=num`

### Description

Controls the trace level for low-level network activities such as connection establishment and read/write operations:

| 0   | No network trace (default).                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Trace successful connection establishment and closure.                                                                                                                                                      |
| 2   | Like 1, but also trace attempts to bind, connect, and disconnect sockets as well as Ice endpoint usage.                                                                                                     |
| 3   | Like 2, but also trace data transfer, the [published endpoints](../object-adapter-endpoints) for an object adapter, and the current list of local addresses for an endpoint that uses the wildcard address. |

## Ice.Trace.Protocol

### Synopsis

`Ice.Trace.Protocol=num`

### Description

Controls the trace level for Ice [protocol messages](../protocol-messages):

| 0   | No protocol trace (default). |
| --- | ---------------------------- |
| 1   | Trace Ice protocol messages. |

## Ice.Trace.Retry

### Synopsis

`Ice.Trace.Retry=num`

### Description

Ice supports [automatic retries](../automatic-retries) in case of a request failure. This property controls the trace
level for retry attempts:

| 0   | No request retry trace (default).                                                           |
| --- | ------------------------------------------------------------------------------------------- |
| 1   | Trace Ice operation call retries.                                                           |
| 2   | Also trace Ice retry for connection establishment failures on Ice locator cached endpoints. |

## Ice.Trace.Slicing

### Synopsis

`Ice.Trace.Slicing=num`

### Description

The Ice data encoding for [exceptions](../data-encoding-for-exceptions) and [classes](../data-encoding-for-classes)
enables a receiver to slice an unknown exception or class type to a known type. This property controls the trace level
for slicing activities:

| 0   | No trace of slicing activity (default).                                                    |
| --- | ------------------------------------------------------------------------------------------ |
| 1   | Trace all exception and class types that are unknown to the receiver and therefore sliced. |

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Trace.ThreadPool

### Synopsis

`Ice.Trace.ThreadPool=num`

### Description

Controls the trace level for the Ice [thread pool](../threading-model):

| 0   | No trace of thread pool activity (default).                 |
| --- | ----------------------------------------------------------- |
| 1   | Trace the creation, growing, and shrinking of thread pools. |

{% /iflang %}
