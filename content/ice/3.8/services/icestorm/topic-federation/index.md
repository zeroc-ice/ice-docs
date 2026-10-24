---
title: Topic Federation
---

A federation links topics together, and the cost associated with each link lets you restrict the flow of events between
topics. You create and remove links with the `link` and `unlink` operations of the
[Topic interface](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1Topic.html), or with the
[administrative tool](../icestorm-administration).

The figures below use dotted arrows for links between topics and solid arrows for publishing and delivering events.

## IceStorm Event Propagation

IceStorm events are never propagated over more than one link. For example, consider the topic graph shown below:

![Publisher PA publishes to topic A, which has a dotted link to B. Publisher PB publishes directly to B. B has a dotted link to C and sends to subscriber SB; C sends to subscriber SC. Solid arrows show event delivery.](/images/ice/3.8/topic-federation/federation1.svg)

In this case, events published on `A` are propagated to `B`, but `B` does not propagate `A`'s events to `C`. Therefore,
subscriber SB receives events published on topics `A` and `B`, but subscriber SC only receives events published on
topics `B` and `C`. If the application needs events to propagate from `A` to `C`, then a link must be established
directly between `A` and `C`.

## Using Cost to Limit Event Propagation

As described above, IceStorm events are only propagated on the originating topic's immediate links. In addition,
applications can use the notion of cost to further restrict event propagation.

Events and links each carry a cost. A topic forwards an event on a link only when the event's cost does not exceed the
link's cost; a link with a cost of `0` carries every event. For example, consider the following topic graph:

![Solid arrows show publishers P1 and P2 sending to topic A with event costs 1 and 2 respectively. Dotted arrows show a link from A to B with cost 0 and a link from A to C with cost 1.](/images/ice/3.8/topic-federation/federation2.svg)

Publisher P1 publishes an event on topic `A` with a cost of `1`. This event is propagated on the link to topic `B`
because the link has a cost of `0` and therefore accepts all events. The event is also propagated on the link to topic
`C`, because the event cost does not exceed the link cost (`1`). On the other hand, the event published by P2 with a
cost of `2` is only propagated on the link to `B`.

### Request Context for Cost

The cost of an event is specified in an Ice [request context](../../../runtime/invocation/request-contexts). Each Ice
proxy operation has an implicit argument of type `Context` representing the request context. This argument is rarely
used, but it is the ideal location for specifying the cost of an IceStorm event because an application only needs to
supply a request context if it actually uses IceStorm's cost feature. If the request context does not contain a cost
value, the event is assigned the default cost, `0`.

### Publishing an Event with a Cost

The C++ code example below demonstrate how a sensor can publish a reading with a cost value of `5`.

```cpp
auto station = Ice::uncheckedCast<WeatherStationPrx>(pub);
Ice::Context context;
context["cost"] = "5";
station->report(sensorId, timeStamp, reading, context);
```

### Receiving an Event with a Cost

A subscriber can retrieve the cost of an event by examining the request context supplied in the
[Current](api:Ice/Current) argument.

## Automating IceStorm Federation

Given the restrictions on event propagation described in the previous sections, creating a complex topic graph can be a
tedious endeavor. Of course, creating a topic graph is not typically a common occurrence, since IceStorm keeps a
persistent record of the graph. However, there are situations where an automated procedure for creating a topic graph
can be valuable, such as during development when the graph might change significantly and often, or when graphs need to
be recomputed based on changing costs.

### Administration Tool Script

A simple way to automate the creation of a topic graph is to create a text file containing commands to be executed by
the IceStorm administration tool. For example, these commands create the topic graph from
[Using Cost to Limit Event Propagation](#using-cost-to-limit-event-propagation):

```text
create A B C
link A B 0
link A C 1
```

If we store these commands in the file `graph.txt`, we can execute them using the following command:

```shell
icestormadmin --Ice.Config=config < graph.txt
```

We assume that the configuration file `config` contains the definition for the property
[IceStormAdmin.TopicManager.Default](../../../property-reference/icestormadmin-properties#icestormadmin.topicmanager.default).

## Proxy Considerations for IceStorm Federation

Note that, if you federate IceStorm servers, you must ensure that the proxies for the linked topics always use the same
host and port (or, alternatively, can be indirectly bound via [IceGrid](../../icegrid)), otherwise the federation cannot
be re-established if one of the servers in the federation shuts down and is restarted later.

## See Also

- [IceStorm Administration](../icestorm-administration)
- [Request Contexts](../../../runtime/invocation/request-contexts)
- [IceStorm Properties](../../../property-reference/icestorm-properties)
- [IceGrid](../../icegrid)
