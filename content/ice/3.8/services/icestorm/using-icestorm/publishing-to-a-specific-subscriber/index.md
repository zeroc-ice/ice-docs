---
title: Publishing to a Specific Subscriber
---

If you send events to the publisher object you obtain by calling `Topic::getPublisher`, the event is forwarded to all
subscribers for that topic:

```cpp
IceStorm::TopicPrx topic = ...;
auto publisher = topic->getPublisher();
auto station = Ice::uncheckedCast<WeatherStationPrx>(publisher);
...
station->report(sensorId, timeStamp, reading); // Sent to all subscribers
```

You can also publish an event to a single specific subscriber, by using the return value of `subscribeAndGetPublisher`.
For example:

```cpp
auto servant = make_shared<ConsolePrinter>();
auto station = adapter->addWithUUID<WeatherStationPrx>(servant)->ice_oneway();

IceStorm::TopicPrx topic = ...;

auto pub = topic->subscribeAndGetPublisher({}, station);
auto pubStation = Ice::uncheckedCast<WeatherStationPrx>(pub);

...
// Sent only to this subscriber
pubStation->report(sensorId, timeStamp, reading);
```

Note that, here, we save the return value of `subscribeAndGetPublisher`. The return value is a proxy that connects
specifically to the `WeatherStation` instance denoted by `station`. However, when the code calls `report` on that proxy,
instead of directly invoking on the `WeatherStation` instance, the request is forwarded via IceStorm.

As it stands, this code is not very interesting. After all, the call to `report` is just a round-about way for the
subscriber to publish a message to itself. However, the subscriber can pass this subscriber-specific publisher proxy to
another process. When that process publishes an event via the proxy, the event is sent only to the specific subscriber,
instead of to all subscribers for the topic. In turn, this is useful if you are using the observer pattern, with all
observers attached to an IceStorm topic.

As an example, we might have a list whose state is to be monitored by a number of observers. Updates to the list are
published to an IceStorm topic, say, `ListUpdates`. The observers of the list subscribe with an interface such as:

```slice
interface ListObserver
{
    void init(/* The entire state of the list */);
    void itemChange(/* The added or deleted item */);
}
```

The idea is that, when an observer first starts observing the list, the `init` operation is called on the observer and
passed the entire list. This initializes the observer with the current state of the list. Thereafter, whenever the list
changes, it calls `itemChange` on the observer to inform it of the addition or deletion of an item. (The details of how
this happens are secondary; the important point is that the observer is informed of the current state of the list
initially and, thereafter, receives incremental updates about modifications to the list, rather than the entire list
whenever it changes.)

The list itself might look something like this:

```slice
interface List
{
    void add(Item i);
    void remove(Item i);

    void addObserver(ListObserver* lo);
    void removeObserver(ListObserver* lo);
}
```

The list provides operations to add and remove an item, as well as operations to add and remove an observer. Every time
`add` or `remove` are called on the list, the list publishes an `itemChange` event to the `ListUpdates` topic; this
informs all the subscribed observers of the change to the list. However, when an observer is first added, the observer's
`init` operation must be called. Moreover, we want to call that method only once for each observer, so we cannot just
publish the initial state of the list on a topic that all observers subscribe to.

The subscriber-specific proxy that is returned by `subscribeAndGetPublisher` solves this nicely: the implementation of
`addObserver` calls `subscribeAndGetPublisher`, and then invokes `init` on the returned per-subscriber publisher. This
both subscribes the observer to the topic, and IceStorm forwards the call to `init` to the observer. This is preferable
to the list invoking `init` on the observer directly: if the observer is misbehaved (for example, if its `init`
implementation blocks for some time), the list is unaffected because IceStorm shields the list from such behavior.

The per-subscriber publisher and the topic's publisher object use the same queue of events for the observer in an
IceStorm server, and IceStorm sends the events of this queue in order. The observer receives `init` before any
`itemChange` only if IceStorm queues `init` before any `itemChange` event published after the subscription. For example,
the list can hold the lock that serializes its updates while it subscribes the observer, takes the snapshot it passes to
`init`, and completes a twoway `init` invocation on the per-subscriber publisher, and publish each `itemChange` event
with a twoway invocation under the same lock. If the observer's thread pool dispatches several requests concurrently,
the observer can start processing an `itemChange` event before it finishes processing `init`, depending on the
[delivery mode](../icestorm-delivery-modes). To make the observer finish processing `init` before it processes any
update, subscribe it with a twoway proxy and the [ordered reliability](../icestorm-quality-of-service) quality of
service.

## See Also

- [Using IceStorm](..)
