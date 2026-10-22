---
title: Publishing to a Specific Subscriber
sidebarLabel: Publish to One Subscriber
---

`Topic::subscribeAndGetPublisher` adds a subscriber to a topic and returns a proxy to a publisher object for this
subscriber: IceStorm forwards an event published through this proxy to this subscriber only. An event published through
the proxy returned by `Topic::getPublisher` goes to all subscribers of the topic.

This per-subscriber publisher serves a specific setup: an observed object that notifies its observers through an
IceStorm topic, and is the only publisher on this topic. When an observer subscribes, the observed object sends it the
current state through the per-subscriber publisher, and IceStorm delivers this state like any other event, so a slow
observer does not delay the observed object. If a slow observer is not a concern, the observed object can call the
observer directly instead.

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

The per-subscriber publisher returned by `subscribeAndGetPublisher` solves this nicely: the implementation of
`addObserver` calls `subscribeAndGetPublisher`, and then invokes `init` on the returned proxy:

```cpp
IceStorm::TopicPrx topic = ...; // The ListUpdates topic
...
auto pub = topic->subscribeAndGetPublisher({}, lo);
auto observer = Ice::uncheckedCast<ListObserverPrx>(pub);
observer->init(/* The entire state of the list */);
```

IceStorm forwards this `init` through the same event queue as the `itemChange` events published on the `ListUpdates`
topic, in the order IceStorm receives them. The observer can therefore receive `itemChange` events published after its
subscription but before `init`.

## See Also

- [Using IceStorm](..)
