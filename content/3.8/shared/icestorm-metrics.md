---
id: icestorm-metrics
title: IceStorm Metrics
---

You can monitor IceStorm using the [Administrative Facility](../administrative-facility) and [the Metrics Facet](../the-metrics-facet). IceStorm provides two metrics class to monitor topic and subscriber related metrics. These classes are defined in `IceStorm/Metrics.ice` and are shown below.

```slice
module IceMX
{
    class TopicMetrics extends Metrics
    {
        long published = 0;
        long forwarded = 0;
    }
    class SubscriberMetrics extends Metrics
    {
        int queued = 0;
        int outstanding = 0; 
        long delivered = 0;
    }
}
```

IceStorm records metrics in the metrics map described below.

| **Metrics map name** | **Slice class** | **Description** | **Property prefix** |
| --- | --- | --- | --- |
| Topic | `IceMX::TopicMetrics` | Topic metrics | `IceMX.Metrics.view-name.Map.Topic` |
| Subscriber | `IceMX::SubscriberMetrics` | Subscriber metrics | `IceMX.Metrics.view-name.Map.Subscriber` |

To configure a metrics view to record IceStorm topic and subscriber you can use for example:

- `IceMX.Metrics.IceStormView.Map.Topic.GroupBy=id`
- `IceMX.Metrics.IceStormView.Map.Subscriber.GroupBy=id`

This will configure a view containing only the `Topic` and `Subscriber` maps. All the topics and subscribers from the IceStorm service will be monitored individually with separate metrics object.

You can use the following attributes when configuring the IceStorm `Topic` map:

| **Name** | **Description** |
| --- | --- |
| id | The id is the topic name. |
| parent | The IceStorm service name. |
| none | The empty string. |
| topic | The topic name. |
| service | The IceStorm service name. |

The `Subscriber` map can be configured with the following attributes:

| **Name** | **Description** |
| --- | --- |
| id | The id of the subscriber metrics is the stringified proxy of the subscriber. |
| parent | The name of the topic name to which this subscriber belongs. |
| none | The empty string. |
| topic | The name of the topic name to which this subscriber belongs. |
| service | The IceStorm service name. |
| identity | The identity of the subscriber proxy. |
| facet | The facet of the subscriber proxy. |
| encoding | The encoding of the subscriber proxy. |
| mode | The mode of the subscriber proxy. |
| proxy | The subscriber proxy. |
| link | The proxy of the topic linked to the the topic which owns this subscriber. |
| state | The state of the subscriber. It can either be "online", "offline" or "error". |

See Also

- [Administrative Facility](../administrative-facility)
- [The Metrics Facet](../the-metrics-facet)
- [IceMX.Metrics.*](../icemx-metrics-properties)
