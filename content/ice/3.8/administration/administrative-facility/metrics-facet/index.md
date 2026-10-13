---
title: The Metrics Facet
---

The `Metrics` facet provides the metrics of the Ice runtime and of the Glacier2 and IceStorm services. The Ice runtime
metrics cover threads and their state, connections, invocations, dispatches, connection establishment, and endpoint
resolution.

## Metrics Terminology

- metric: a measurement that the Ice runtime records, such as the number of bytes sent over a connection.
- metrics object: the metrics of one or more instrumented objects or operations, such as all the invocations of the
  `sayHello` operation.
- metrics map: the metrics objects of one kind of instrumented object or operation, such as the `Connection` map, which
  by default holds one metrics object per connection.
- metrics view: a named set of metrics maps that you configure and enable together; see
  [Configuring Metrics Views](#configuring-metrics-views).

## Metrics Types

Metrics are specified as Slice classes defined in the `Ice/Metrics.ice` Slice file. All the metrics types are defined in
the `IceMX` module.

The base class is [`IceMX::Metrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1Metrics.html):

```slice
class Metrics
{
    string id;
    long total = 0;
    int current = 0;
    long totalLifetime = 0;
    int failures = 0;
}
```

A metrics object is an instance of `IceMX::Metrics` and represents metrics of one or more instrumented objects. An
instrumented object can be anything that supports instrumentation. The Ice runtime supports instrumentation of the
following objects and activities:

- Threads
- Connections
- Invocations
- Dispatches
- Connection establishment
- Endpoint resolution

The members of `Metrics` are:

- `id`: the ID of the metrics object, built from the attributes named by the map's
  [GroupBy](../../../property-reference/icemx-metrics-properties#icemx.metrics.view.groupby) property.
- `total`: the number of instrumented objects or operations that the metrics object has observed since its creation.
- `current`: the number of instrumented objects or operations it observes now.
- `totalLifetime`: the sum, in microseconds, of the lifetimes of the instrumented objects or operations it no longer
  observes.
- `failures`: the number of failures that have occurred for these instrumented objects or operations.

Each [`IceMX::MetricsFailures`](https://code.zeroc.com/ice/3.8/api/slice/structIceMX_1_1MetricsFailures.html) structure
counts the failures of one metrics object:

```slice
struct MetricsFailures
{
    string id;
    StringIntDict failures;
}
```

- `id`: the ID of the metrics object.
- `failures`: the number of failures of each kind, keyed by the exception that caused them, such as
  `::Ice::ConnectionLostException` or `::Ice::CloseTimeoutException` for a connection.

A metrics map is simply defined as a sequence of `IceMX::Metrics` objects, and a metrics view is defined as a dictionary
of metrics map:

```slice
sequence<Metrics> MetricsMap;
dictionary<string, MetricsMap> MetricsView;
```

The key for the metrics view dictionary is a string that identifies the metrics map. The Ice runtime supports the
following metrics maps:

| **Metrics map name**    | **Slice class**                                                                                             | **Description**                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Connection              | [`IceMX::ConnectionMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1ConnectionMetrics.html) | Connection metrics.                                                                                                                       |
| Thread                  | [`IceMX::ThreadMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1ThreadMetrics.html)         | Thread metrics. The Ice runtime instruments threads for the communicator's thread pools as well as threads used internally.               |
| Invocation              | [`IceMX::InvocationMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1InvocationMetrics.html) | Client-side proxy invocation metrics.                                                                                                     |
| Dispatch                | [`IceMX::DispatchMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1DispatchMetrics.html)     | Server-side dispatch metrics.                                                                                                             |
| EndpointLookup          | [`IceMX::Metrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1Metrics.html)                     | Endpoint lookup metrics. For tcp, ssl and udp endpoints, this corresponds to the DNS lookups made to resolve the host names in endpoints. |
| ConnectionEstablishment | [`IceMX::Metrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1Metrics.html)                     | Connection establishment metrics.                                                                                                         |

The `Invocation` map has two sub-maps, stored in each `IceMX::InvocationMetrics` object:

- `Remote`, in the `remotes` member:
  [`IceMX::RemoteMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1RemoteMetrics.html) objects for the
  invocations sent over a connection.
- `Collocated`, in the `collocated` member:
  [`IceMX::CollocatedMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1CollocatedMetrics.html) objects
  for the collocated invocations.

Both classes derive from
[`IceMX::ChildInvocationMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1ChildInvocationMetrics.html):
each records a child invocation, and an invocation that Ice retries can have several.

The classes derived from `IceMX::Metrics` add the following members:

| **Slice class**                 | **Members**                                                                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IceMX::ConnectionMetrics`      | `receivedBytes` and `sentBytes`: the number of bytes received and sent by the connections.                                                                                 |
| `IceMX::ThreadMetrics`          | `inUseForIO`, `inUseForUser`, and `inUseForOther`: the number of threads currently performing socket reads or writes, calling application code, or doing other activities. |
| `IceMX::InvocationMetrics`      | `retry`: the number of retries; `userException`: the number of invocations that failed with a user exception; `remotes` and `collocated`: the sub-metrics maps.            |
| `IceMX::DispatchMetrics`        | `userException`: the number of dispatches that failed with a user exception; `size` and `replySize`: the accumulated size of the marshaled requests and replies.           |
| `IceMX::ChildInvocationMetrics` | `size` and `replySize`: the accumulated size of the marshaled requests and replies.                                                                                        |

## The `MetricsAdmin` Interface

The Slice interface
[`IceMX::MetricsAdmin`](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceMX_1_1MetricsAdmin.html) allows you to
retrieve the metrics associated with the Ice communicator:

```slice
module IceMX
{
    exception UnknownMetricsView {}

    interface MetricsAdmin
    {
        Ice::StringSeq getMetricsViewNames(out Ice::StringSeq disabledViews);

        void enableMetricsView(string name)
            throws UnknownMetricsView;

        void disableMetricsView(string name)
            throws UnknownMetricsView;

        MetricsView getMetricsView(string view, out long timestamp)
            throws UnknownMetricsView;

        MetricsFailuresSeq getMapMetricsFailures(string view, string map)
            throws UnknownMetricsView;

        MetricsFailures getMetricsFailures(string view, string map, string id)
            throws UnknownMetricsView;
    }
}
```

`MetricsAdmin` provides the following operations:

- `getMetricsViewNames`: returns the names of the enabled views, and the names of the disabled views in its
  `disabledViews` out parameter.
- `enableMetricsView` and `disableMetricsView`: enable or disable a view, like setting its
  [Disabled](../../../property-reference/icemx-metrics-properties) property to 0 or 1, respectively.
- `getMetricsView`: returns the metrics of a view, or an empty view for a disabled view. Its `timestamp` out parameter
  is the process's time, in milliseconds, when the metrics were retrieved; its reference point depends on the language
  mapping, so compare only timestamps from the same process.
- `getMapMetricsFailures`: returns the failures of the metrics objects of a map that have recorded at least one failure.
- `getMetricsFailures`: returns the failures of the metrics object with the given ID.

Each operation that takes a view name throws
[`UnknownMetricsView`](https://code.zeroc.com/ice/3.8/api/slice/exceptionIceMX_1_1UnknownMetricsView.html) when no view
with this name is configured.

{% language-section name="mapping" /%}

## Configuring Metrics Views

The `Metrics` facet records metrics only for the views you configure with
[IceMX Metrics properties](../../../property-reference/icemx-metrics-properties). For example, the following
configuration enables the `Metrics` facet and defines a view named `Debug` that records invocation and dispatch metrics
grouped by operation:

```config
Ice.Admin.Endpoints=tcp -h localhost -p 10002
Ice.Admin.InstanceName=MyServer
IceMX.Metrics.Debug.Map.Invocation.GroupBy=operation
IceMX.Metrics.Debug.Map.Invocation.Map.Remote.GroupBy=id
IceMX.Metrics.Debug.Map.Invocation.Map.Collocated.GroupBy=id
IceMX.Metrics.Debug.Map.Dispatch.GroupBy=operation
```

When the [Properties facet](../properties-facet) is also enabled, the `Metrics` facet applies updates of `IceMX.*`
properties made through this facet: it creates, updates, or removes the corresponding views and maps. Ice discards the
metrics recorded by a map when it reconfigures this map, and the metrics recorded by a view when it disables this view;
a view that is enabled again gets new maps. A map keeps the metrics objects with a `current` value of 0 up to the limit
set by [RetainDetached](../../../property-reference/icemx-metrics-properties).

## Metrics Attributes

Metrics views are configured with [IceMX Metrics properties](../../../property-reference/icemx-metrics-properties).

The `GroupBy`, `Accept` and `Reject` properties are specified using attributes that are specific to each metrics map.
The table below describes the attributes supported by the Ice runtime's metrics maps.

| **Name**           | **Maps**                                                              | **Description**                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | All                                                                   | A unique identifier to select the instrumented object or operation.                                                                                  |
| parent             | All                                                                   | The parent of the instrumented object or operation.                                                                                                  |
| none               | All                                                                   | The none attribute is a special attribute that evaluates to the empty string.                                                                        |
| endpoint           | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | The stringified endpoint.                                                                                                                            |
| endpointType       | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | The endpoint numerical type, as defined in `Ice/EndpointTypes.ice`.                                                                                  |
| endpointIsDatagram | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | A boolean indicating if the endpoint is a datagram endpoint.                                                                                         |
| endpointIsSecure   | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | A boolean indicating if the endpoint is secure.                                                                                                      |
| endpointCompress   | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | A boolean indicating if the endpoint requires compression.                                                                                           |
| endpointHost       | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | The endpoint host.                                                                                                                                   |
| endpointPort       | Connection, Dispatch, Remote, ConnectionEstablishment, EndpointLookup | The endpoint port.                                                                                                                                   |
| connection         | Dispatch                                                              | The connection description, provided by the C++ runtime only.                                                                                        |
| incoming           | Connection, Dispatch, Remote                                          | A boolean where true indicates an incoming (server) connection and false an outgoing (client) connection.                                            |
| adapterName        | Connection, Dispatch, Remote                                          | If the connection is a server connection, adapterName returns the name of the adapter that created the connection, otherwise it is the empty string. |
| connectionId       | Connection, Dispatch, Remote                                          | The ID of the connection if one is set, otherwise it is the empty string.                                                                            |
| localHost          | Connection, Dispatch, Remote                                          | The connection's local address.                                                                                                                      |
| localPort          | Connection, Dispatch, Remote                                          | The connection's local port.                                                                                                                         |
| remoteHost         | Connection, Dispatch, Remote                                          | The connection's remote address.                                                                                                                     |
| remotePort         | Connection, Dispatch, Remote                                          | The connection's remote port.                                                                                                                        |
| mcastHost          | Connection, Dispatch, Remote                                          | The connection's multicast address.                                                                                                                  |
| mcastPort          | Connection, Dispatch, Remote                                          | The connection's multicast port.                                                                                                                     |
| state              | Connection                                                            | The state of the connection.                                                                                                                         |
| operation          | Dispatch, Invocation                                                  | The dispatched or invoked operation name.                                                                                                            |
| identity           | Dispatch, Invocation                                                  | The identity of the Ice object used for the dispatch or invocation.                                                                                  |
| facet              | Dispatch, Invocation                                                  | The facet of the Ice object used for the dispatch or invocation.                                                                                     |
| mode               | Dispatch, Invocation                                                  | The dispatch or invocation mode.                                                                                                                     |
| context*.key*      | Dispatch, Invocation                                                  | The value of the dispatch or invocation context with the given key.                                                                                  |
| proxy              | Invocation                                                            | The proxy used for the invocation.                                                                                                                   |
| encoding           | Invocation                                                            | The proxy encoding.                                                                                                                                  |
| requestId          | Dispatch, Remote, Collocated                                          | The request ID of the dispatch or invocation; 0 for a oneway request.                                                                                |

The `id`, `parent` and `none` attributes are supported by all maps.

An attribute resolves only when the instrumented object provides the corresponding information: the connection
attributes of a Dispatch observation require a connection, `localHost`, `localPort`, `remoteHost`, and `remotePort`
require an IP connection, `mcastHost` and `mcastPort` require a UDP connection, and `endpointHost` and `endpointPort`
require an IP endpoint. A map does not record an observation whose `GroupBy` attributes do not all resolve.

The value of the `parent` attribute depends on the map. For the Dispatch map, it is the name of the object adapter that
dispatches the request. For the Connection and Remote maps, it is the name of the connection's object adapter, or
"Communicator" for a connection without an object adapter. For the Invocation, Collocated, EndpointLookup, and
ConnectionEstablishment maps, it is always "Communicator". For the Thread map, it is the name of the component that owns
the thread, such as the configuration prefix of a thread pool, or "Communicator". The `parent` attribute enables the
filtering of metrics based on the object adapter. When used with the `GroupBy` property it also allows you to obtain
metrics at the object adapter level. For instance, the following configuration does not monitor any metrics for the
`Ice.Admin` object adapter and it groups all the metrics based on the object adapter or communicator:

```config
IceMX.Metrics.MyView.GroupBy=parent
IceMX.Metrics.MyView.Reject.parent=Ice\.Admin   # Escape the dot in Ice.Admin
```

This configuration enables the communicator to get metrics on a per object adapter or communicator basis.

You can also use the `none` attribute to get metrics for the communicator including the metrics from object adapters,
e.g., `IceMX.Metrics.MyView.GroupBy=none`. This provides the lowest possible level of detail as each metrics map records
all its statistics in a single metrics object.

The `id` attribute allows you to get a higher level of detail. Each map computes `id` from its instrumented object or
operation; for example, the id of a dispatch is the target identity followed by the operation name. If you specify
`IceMX.Metrics.MyView.GroupBy=id`, the `Metrics` facet records the observations with the same id in the same metrics
object.

{% iflang langs="cpp,csharp,java" %}

## Custom Instrumentation

To observe the Ice runtime with your own instrumentation, set the `observer` member of `InitializationData` to your
implementation of
{% iflang langs="cpp" %}`Ice::Instrumentation::CommunicatorObserver`{% /iflang %}{% iflang langs="csharp" %}`Ice.Instrumentation.CommunicatorObserver`{% /iflang %}{% iflang langs="java" %}`com.zeroc.Ice.Instrumentation.CommunicatorObserver`{% /iflang %}.
When the `Metrics` facet is enabled, Ice calls this observer only for the kinds of objects and operations whose map at
least one enabled view includes; for example, it reports invocations only while an enabled view has an Invocation map.

{% /iflang %}

## See Also

- [IceMX.Metrics.\*](../../../property-reference/icemx-metrics-properties)
- [Glacier2 Metrics](../../../services/glacier2/glacier2-metrics)
- [IceStorm Metrics](../../../services/icestorm/icestorm-metrics)
