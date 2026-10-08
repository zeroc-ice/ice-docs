---
title: IceStorm Metrics
---

You can monitor IceStorm using the [Administrative Facility](../../../administration/administrative-facility) and
[the Metrics Facet](../../../administration/administrative-facility/metrics-facet). IceStorm provides two metrics class
to monitor topic and subscriber related metrics. These classes are defined in `IceStorm/Metrics.ice` and are shown
below.

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

These classes provide the following metrics:

| **Metric**    | **Description**                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `published`   | The number of events that publishers sent to the topic.                                                                                                                                                                               |
| `forwarded`   | The number of events the topic received from linked topics.                                                                                                                                                                           |
| `queued`      | The number of events IceStorm queued for the subscriber and has not started sending yet.                                                                                                                                              |
| `outstanding` | The number of events IceStorm started sending to the subscriber and whose delivery has not completed.                                                                                                                                 |
| `delivered`   | The number of events whose delivery completed: IceStorm counts an event as delivered when it receives the reply for a twoway subscriber or a topic link, and when it has sent the request for a oneway, datagram or batch subscriber. |

IceStorm records metrics in the metrics map described below.

| **Metrics map name** | **Slice class**            | **Description**    | **Property prefix**                      |
| -------------------- | -------------------------- | ------------------ | ---------------------------------------- |
| Topic                | `IceMX::TopicMetrics`      | Topic metrics      | `IceMX.Metrics.view-name.Map.Topic`      |
| Subscriber           | `IceMX::SubscriberMetrics` | Subscriber metrics | `IceMX.Metrics.view-name.Map.Subscriber` |

To configure a metrics view to record IceStorm topic and subscriber you can use for example:

- `IceMX.Metrics.IceStormView.Map.Topic.GroupBy=id`
- `IceMX.Metrics.IceStormView.Map.Subscriber.GroupBy=id`

This will configure a view containing only the `Topic` and `Subscriber` maps, with one metrics object per topic and one
metrics object per subscriber. The `id` of a subscriber is its stringified proxy, so a subscriber that subscribes to
several topics with identical proxies gets a single metrics object for all these topics; use
`IceMX.Metrics.IceStormView.Map.Subscriber.GroupBy=topic,id` to get one metrics object per subscription.

You can use the following attributes when configuring the IceStorm `Topic` map:

| **Name** | **Description**        |
| -------- | ---------------------- |
| id       | The topic name.        |
| parent   | The string `IceStorm`. |
| none     | The empty string.      |
| topic    | The topic name.        |
| service  | The string `IceStorm`. |

The `Subscriber` map can be configured with the following attributes:

| **Name**     | **Description**                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| id           | The stringified proxy of the subscriber.                                                               |
| parent       | The name of the topic to which this subscriber belongs.                                                |
| none         | The empty string.                                                                                      |
| topic        | The name of the topic to which this subscriber belongs.                                                |
| service      | The string `IceStorm`.                                                                                 |
| identity     | The identity of the subscriber proxy.                                                                  |
| facet        | The facet of the subscriber proxy.                                                                     |
| encoding     | The encoding of the subscriber proxy.                                                                  |
| mode         | The mode of the subscriber proxy: `twoway`, `oneway`, `batch-oneway`, `datagram`, or `batch-datagram`. |
| proxy        | The subscriber proxy.                                                                                  |
| link         | The proxy of the topic linked to the topic which owns this subscriber.                                 |
| state        | The state of the subscriber. It can either be "online", "offline" or "error".                          |
| `qos.<name>` | The value of the `<name>` entry in the subscriber's QoS, or `default` if the QoS has no such entry.    |

For example, `IceMX.Metrics.IceStormView.Map.Subscriber.GroupBy=qos.reliability` groups subscribers by the value of
their `reliability` QoS.

## See Also

- [Administrative Facility](../../../administration/administrative-facility)
- [The Metrics Facet](../../../administration/administrative-facility/metrics-facet)
- [IceMX.Metrics.*](../../../property-reference/icemx-metrics-properties)
