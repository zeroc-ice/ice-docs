---
title: Glacier2 Metrics
---

You can monitor Glacier2 using the [Administrative Facility](../../../administration/administrative-facility) and
[the Metrics Facet](../../../administration/administrative-facility/metrics-facet). Glacier2 provides a metrics class to
monitor session related metrics. The Glacier2 session metrics class is defined in `Glacier2/Metrics.ice` and is shown
below.

```slice
namespace IceMX
{
    class SessionMetrics extends Metrics
    {
        int forwardedClient = 0;
        int forwardedServer = 0;
        int routingTableSize = 0;

        // deprecated fields
        ...
    }
}
```

Glacier2 records session metrics in the `Session` metrics map, the metrics objects contained in this map are instances
of the `IceMX::SessionMetrics` class show above. To configure a metrics view to record Glacier2 session metrics you can
use [metrics properties](../../../property-reference/icemx-metrics-properties) with the
`IceMX.Metrics.view-name.Map.Session` prefix, for example:

- `IceMX.Metrics.SessionView.Map.Session.GroupBy=id` to configure a view containing one metrics object per session.
- `IceMX.Metrics.SessionView.Map.Session.GroupBy=none to` configure a view containing a single metrics object with
  metrics for all the sessions.

You can use the following attributes when configuring the Glacier2 Session metrics map:

| **Name**           | **Description**                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | A unique identifier to identify the session. This corresponds to the user Id for sessions created with a username/password and to the subject DN for sessions created from SSL. |
| parent             | The Glacier2 router instance name.                                                                                                                                              |
| none               | The empty string.                                                                                                                                                               |
| endpoint           | The stringified endpoint.                                                                                                                                                       |
| endpointType       | The endpoint numerical type as defined in `Ice/Endpoint.ice.`                                                                                                                   |
| endpointIsDatagram | A boolean indicating if the endpoint is a datagram endpoint.                                                                                                                    |
| endpointIsSecure   | A boolean indicating if the endpoint is secure.                                                                                                                                 |
| endpointTimeout    | The endpoint timeout.                                                                                                                                                           |
| endpointCompress   | A boolean indicating if the endpoint requires compression.                                                                                                                      |
| endpointHost       | The endpoint host.                                                                                                                                                              |
| endpointPort       | The endpoint port.                                                                                                                                                              |
| connection         | The connection description.                                                                                                                                                     |
| incoming           | A boolean indicating if the connection is a server or client connection.                                                                                                        |
| adapterName        | If the connection is a server connection, adapterName will return the name of the adapter which created the connection, it will contain the empty string otherwise.             |
| connectionId       | The ID of the connection if one is set, the empty string otherwise.                                                                                                             |
| localAddress       | The connection's local address.                                                                                                                                                 |
| localPort          | The connection's local port.                                                                                                                                                    |
| remoteAddress      | The connection's remote address.                                                                                                                                                |
| remotePort         | The connection's remote port.                                                                                                                                                   |
| mcastAddress       | The connection's multicast address.                                                                                                                                             |
| mcastPort          | The connection's multicast port.                                                                                                                                                |
| state              | The state of the connection.                                                                                                                                                    |

The connection and endpoint attributes are for the connection tied to the Glacier2 session.

## See Also

- [Administrative Facility](../../../administration/administrative-facility)
- [The Metrics Facet](../../../administration/administrative-facility/metrics-facet)
- [IceMX.Metrics.*](../../../property-reference/icemx-metrics-properties)
