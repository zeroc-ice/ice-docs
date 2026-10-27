---
title: The Metrics Facet
sidebarLabel: Metrics Facet
---

The `Metrics` facet provides the metrics of the Ice runtime and of the Glacier2 and IceStorm services. The Ice runtime
metrics cover threads and their state, connections, invocations, dispatches, connection establishment, and endpoint
resolution.

## Metrics Terminology

- metric: a measurement that the Ice runtime records, such as the number of bytes sent over a connection.
- instrumented object: what the Ice runtime measures: a thread, a connection, an invocation, a dispatch, a connection
  establishment, or an endpoint lookup.
- metrics object: the metrics of one or more instrumented objects, such as all the invocations of the `sayHello`
  operation.
- metrics map: the metrics objects of one kind of instrumented object, keyed by their `id`, such as the `Connection`
  map, which by default holds one metrics object per connection.
- metrics view: a named set of metrics maps that you configure and enable
  together{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}; see
  [Configuring Metrics Views](#configuring-metrics-views){% /iflang %}.

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

The fields of `Metrics` are:

- `id`: The ID of the metrics object, built from the attributes named by the map's
  [GroupBy](../../../property-reference/icemx-metrics-properties#icemx.metrics.view.groupby) property.
- `total`: The number of instrumented objects that the metrics object has observed since its creation.
- `current`: The number of instrumented objects it observes now.
- `totalLifetime`: The sum, in microseconds, of the lifetimes of the instrumented objects it no longer observes.
- `failures`: The number of failures that have occurred for these instrumented objects.

Each [`IceMX::MetricsFailures`](https://code.zeroc.com/ice/3.8/api/slice/structIceMX_1_1MetricsFailures.html) structure
counts the failures of one metrics object:

```slice
struct MetricsFailures
{
    string id;
    StringIntDict failures;
}
```

- `id`: The ID of the metrics object.
- `failures`: The number of failures of each kind, keyed by the type ID of the exception that caused them, such as
  `::Ice::ConnectionLostException` for a connection.

A metrics map is simply defined as a sequence of `IceMX::Metrics` objects, and a metrics view is defined as a dictionary
of metrics map:

```slice
sequence<Metrics> MetricsMap;
dictionary<string, MetricsMap> MetricsView;
```

The key for the metrics view dictionary is a string that identifies the metrics map. The Ice runtime supports the
following metrics maps:

| **Metrics map name**    | **Slice class**                                                                                             | **Description**                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Connection              | [`IceMX::ConnectionMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1ConnectionMetrics.html) | Connection metrics.                                                                                                                              |
| Thread                  | [`IceMX::ThreadMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1ThreadMetrics.html)         | Thread metrics: the threads of the client, server, and object adapter thread pools, and the communicator's timer and DNS lookup threads.         |
| Invocation              | [`IceMX::InvocationMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1InvocationMetrics.html) | Client-side proxy invocation metrics.                                                                                                            |
| Dispatch                | [`IceMX::DispatchMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1DispatchMetrics.html)     | Server-side dispatch metrics.                                                                                                                    |
| EndpointLookup          | [`IceMX::Metrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1Metrics.html)                     | Endpoint lookup metrics. For `tcp`, `ssl`, and `udp` endpoints, this corresponds to the DNS lookups made to resolve the host names in endpoints. |
| ConnectionEstablishment | [`IceMX::Metrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1Metrics.html)                     | Connection establishment metrics.                                                                                                                |

An invocation on a proxy results in one or more child invocations: a remote invocation each time Ice sends the request
over a connection, or a collocated invocation each time Ice dispatches it directly to a collocated object adapter. An
invocation that Ice retries has several child invocations. The `Invocation` map records them in two sub-maps, stored in
each `IceMX::InvocationMetrics` object:

- `Remote`, in the `remotes` field:
  [`IceMX::RemoteMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1RemoteMetrics.html) objects for the
  remote invocations.
- `Collocated`, in the `collocated` field:
  [`IceMX::CollocatedMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1CollocatedMetrics.html) objects
  for the collocated invocations.

Both classes derive from
[`IceMX::ChildInvocationMetrics`](https://code.zeroc.com/ice/3.8/api/slice/classIceMX_1_1ChildInvocationMetrics.html).

The classes derived from `IceMX::Metrics` add the following fields:

| **Slice class**                 | **Fields**                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IceMX::ConnectionMetrics`      | `receivedBytes` and `sentBytes`: the number of bytes received and sent by the connections.                                                                                                                |
| `IceMX::ThreadMetrics`          | `inUseForIO`, `inUseForUser`, and `inUseForOther`: the number of threads currently performing socket reads or writes, calling application code, or doing other work such as a DNS lookup or a timer task. |
| `IceMX::InvocationMetrics`      | `retry`: the number of retries; `userException`: the number of invocations that failed with a user exception; `remotes` and `collocated`: the sub-metrics maps.                                           |
| `IceMX::DispatchMetrics`        | `userException`: the number of dispatches that failed with a user exception; `size` and `replySize`: the accumulated size of the marshaled requests and replies.                                          |
| `IceMX::ChildInvocationMetrics` | `size` and `replySize`: the accumulated size of the marshaled requests and replies.                                                                                                                       |

## The `MetricsAdmin` Interface

The `Metrics` facet implements the Slice interface
[`IceMX::MetricsAdmin`](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceMX_1_1MetricsAdmin.html), whose operations
return the metrics of a view and the failures recorded by a map or by a metrics object, and enable or disable a view.
Enabling or disabling a view has the same effect as setting its
[Disabled](../../../property-reference/icemx-metrics-properties#icemx.metrics.view.disabled) property to `0` or `1`.

{% language-section name="mapping" /%}

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

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

You can also update the `IceMX.*` properties at run time through the [Properties facet](../properties-facet): the
`Metrics` facet then creates, updates, or removes the corresponding views and maps. A map that you reconfigure and a
view that you disable lose the metrics they recorded.

{% /iflang %}

## Metrics Attributes

The `GroupBy`, `Accept` and `Reject` properties are specified using attributes that are specific to each metrics map.
The tables below describe the attributes supported by the Ice runtime's metrics maps, grouped by what they describe.

### Attributes of Every Map

All maps support these attributes:

| Attribute | Description                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `id`      | The identifier the map computes for the instrumented object; see [Grouping Examples](#grouping-examples). |
| `parent`  | The parent of the instrumented object; see [The parent Attribute](#the-parent-attribute).                 |
| `none`    | A special attribute that evaluates to the empty string.                                                   |

### Endpoint Attributes

The Connection, Dispatch, Remote, ConnectionEstablishment, and EndpointLookup maps support these attributes:

| Attribute            | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `endpoint`           | The stringified endpoint.                                           |
| `endpointType`       | The endpoint numerical type, as defined in `Ice/EndpointTypes.ice`. |
| `endpointIsDatagram` | A boolean indicating if the endpoint is a datagram endpoint.        |
| `endpointIsSecure`   | A boolean indicating if the endpoint is secure.                     |
| `endpointCompress`   | A boolean indicating whether the endpoint has the `-z` option.      |
| `endpointHost`       | The endpoint host.                                                  |
| `endpointPort`       | The endpoint port.                                                  |

### Connection Attributes

The Connection, Dispatch, and Remote maps support these attributes:

| Attribute      | Description                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `incoming`     | A boolean indicating if the connection is an incoming connection.                                                    |
| `adapterName`  | The name of the object adapter that accepted an incoming connection, or the empty string for an outgoing connection. |
| `connectionId` | The ID of the connection if one is set, otherwise it is the empty string.                                            |
| `localHost`    | The connection's local address.                                                                                      |
| `localPort`    | The connection's local port.                                                                                         |
| `remoteHost`   | The connection's remote address.                                                                                     |
| `remotePort`   | The connection's remote port.                                                                                        |
| `mcastHost`    | The connection's multicast address.                                                                                  |
| `mcastPort`    | The connection's multicast port.                                                                                     |

### Request Attributes

The Dispatch and Invocation maps support these attributes:

| Attribute       | Description                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `operation`     | The dispatched or invoked operation name.                                                                                                       |
| `identity`      | The identity of the Ice object used for the dispatch or invocation.                                                                             |
| `facet`         | The facet of the Ice object used for the dispatch or invocation.                                                                                |
| `mode`          | The invocation mode: `twoway`, `oneway`, `batch-oneway`, `datagram` or `batch-datagram` for an invocation; `twoway` or `oneway` for a dispatch. |
| `context.`_key_ | The value of the dispatch or invocation context with the given key.                                                                             |

The Dispatch, Remote, and Collocated maps support the `requestId` attribute: the request ID of the dispatch or
invocation; 0 for a oneway request.

### Attributes of a Single Map

| Attribute    | Map        | Description                                                                                |
| ------------ | ---------- | ------------------------------------------------------------------------------------------ |
| `state`      | Connection | The state of the connection.                                                               |
| `connection` | Dispatch   | The connection description, provided by Ice for C++ and the language mappings built on it. |
| `proxy`      | Invocation | The proxy used for the invocation.                                                         |
| `encoding`   | Invocation | The proxy encoding.                                                                        |

### The `parent` Attribute

The value of the `parent` attribute depends on the map:

| Map                                                                 | Value of `parent`                                                                                                     |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Dispatch                                                            | The name of the object adapter that dispatches the request.                                                           |
| Connection                                                          | The name of the object adapter that accepted the connection, or "Communicator" for an outgoing connection.            |
| Remote                                                              | The parent of the connection that carries the request.                                                                |
| Invocation, Collocated, EndpointLookup, and ConnectionEstablishment | Always "Communicator".                                                                                                |
| Thread                                                              | The name of the component that owns the thread, such as the configuration prefix of a thread pool, or "Communicator". |

### Grouping Examples

The `GroupBy` property sets the level of detail of a map:

- `GroupBy=parent` groups the metrics by object adapter or communicator. For instance, the following configuration
  groups all the metrics this way and does not monitor any metrics for the `Ice.Admin` object adapter:

  ```config
  IceMX.Metrics.MyView.GroupBy=parent
  IceMX.Metrics.MyView.Reject.parent=Ice\.Admin   # Escape the dot in Ice.Admin
  ```

- `GroupBy=none` records all the statistics of a map in a single metrics object, for the whole communicator:

  ```config
  IceMX.Metrics.MyView.GroupBy=none
  ```

- `GroupBy=id` records the statistics of a map in one metrics object per id. Each map computes `id` from its
  instrumented object; for example, the id of a dispatch is the target identity followed by the operation name:

  ```config
  IceMX.Metrics.MyView.GroupBy=id
  ```

{% iflang langs="cpp,csharp,java" %}

## Custom Instrumentation

To observe the Ice runtime with your own instrumentation, set the `observer` member of
[`InitializationData`](api:Ice/InitializationData) to your implementation of
[`CommunicatorObserver`](api:Ice/Instrumentation/CommunicatorObserver).

{% /iflang %}

## See Also

- [IceMX.Metrics.\*](../../../property-reference/icemx-metrics-properties)
- [Glacier2 Metrics](../../../services/glacier2/glacier2-metrics)
- [IceStorm Metrics](../../../services/icestorm/icestorm-metrics)
- [Using the admin Object](../using-the-admin-object)
