---
id: topic-federation
title: Topic Federation
---

The ability to link topics together into a federation provides IceStorm applications with a lot of flexibility, while
the notion of a "cost" associated with links allows applications to restrict the flow of messages in creative ways.
IceStorm applications have complete control of topic federation using the
[TopicManager interface](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1TopicManager.html), allowing
links to be created and removed dynamically as necessary. For many applications, however, the topic graph is static and
therefore can be configured using the [administrative tool](../icestorm-administration).

# IceStorm Message Propagation

IceStorm messages are never propagated over more than one link. For example, consider the topic graph shown below:

![federation1.gif](/attachments/3.8/topic-federation/federation1.gif)

In this case, messages published on `A` are propagated to `B`, but `B` does not propagate `A`'s messages to `C`.
Therefore, subscriber SB receives messages published on topics `A` and B, but subscriber SC only receives messages
published on topics `B` and `C`. If the application needs messages to propagate from `A` to `C`, then a link must be
established directly between `A` and `C`.

# Using Cost to Limit Message Propagation

As described above, IceStorm messages are only propagated on the originating topic's immediate links. In addition,
applications can use the notion of cost to further restrict message propagation.

A cost is associated with messages and links. When a message is published on a topic, the topic compares the cost
associated with each of its links against the message cost, and only propagates the message on those links whose cost
equals or exceeds the message cost. A cost value of zero (`0`) has the following implications:

- messages with a cost value of zero (`0`) are published on all of the topic's links regardless of the link cost;
- links with a cost value of zero (`0`) accept all messages regardless of the message cost. For example, consider the
  following topic graph:

![federation2.gif](/attachments/3.8/topic-federation/federation2.gif)

Publisher P1 publishes a message on topic `A` with a cost of `1`. This message is propagated on the link to topic `B`
because the link has a cost of `0` and therefore accepts all messages. The message is also propagated on the link to
topic `C`, because the message cost does not exceed the link cost (`1`). On the other hand, the message published by P2
with a cost of `2` is only propagated on the link to `B`.

## Request Context for Cost

The cost of a message is specified in an Ice [request context](../request-contexts). Each Ice proxy operation has an
implicit argument of type `Context` representing the request context. This argument is rarely used, but it is the ideal
location for specifying the cost of an IceStorm message because an application only needs to supply a request context if
it actually uses IceStorm's cost feature. If the request context does not contain a cost value, the message is assigned
the default cost value of zero (0).

## Publishing a Message with a Cost

The C++ code example below demonstrate how a sensor can publish a reading with a cost value of `5`.

```cpp
auto station = Ice::uncheckedCast<WeatherStationPrx>(pub);
Ice::Context context;
context["cost"] = "5";
station->report(sensorId, timeStamp, reading, context);
```

## Receiving a Message with a Cost

A subscriber can retrieve the cost of a message by examining the request context supplied in the
[Current](https://code.zeroc.com/manual/Ice/Current) argument.

# Automating IceStorm Federation

Given the restrictions on message propagation described in the previous sections, creating a complex topic graph can be
a tedious endeavor. Of course, creating a topic graph is not typically a common occurrence, since IceStorm keeps a
persistent record of the graph. However, there are situations where an automated procedure for creating a topic graph
can be valuable, such as during development when the graph might change significantly and often, or when graphs need to
be recomputed based on changing costs.

## Administration Tool Script

A simple way to automate the creation of a topic graph is to create a text file containing commands to be executed by
the IceStorm administration tool. For example, the commands to create the topic graph shown
[earlier](../topic-federation) are shown below:

```
create A B C
link A B 0
link A C 1
```

If we store these commands in the file `graph.txt`, we can execute them using the following command:

```shell
icestormadmin --Ice.Config=config < graph.txt
```

We assume that the configuration file `config` contains the definition for the property
[IceStormAdmin.TopicManager.Default](../icestormadmin-properties).

# Proxy Considerations for IceStorm Federation

Note that, if you federate IceStorm servers, you must ensure that the proxies for the linked topics always use the same
host and port (or, alternatively, can be indirectly bound via [IceGrid](../icegrid)), otherwise the federation cannot be
re-established if one of the servers in the federation shuts down and is restarted later.

##### See Also

- [IceStorm Administration](../icestorm-administration)
- [Request Contexts](../request-contexts)
- [IceStorm Properties](../icestorm-properties)
- [IceGrid](../icegrid)
