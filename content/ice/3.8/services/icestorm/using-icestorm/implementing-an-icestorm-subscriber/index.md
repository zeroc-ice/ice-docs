---
title: Implementing an IceStorm Subscriber
---

An IceStorm subscriber is an Ice server application that hosts a subscriber object, and registers a proxy to this object
with a [Topic](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1Topic.html) hosted by the IceStorm service.

The `IceStorm/weather` demo program provides a complete subscriber application. It’s available in all programming
languages with server-side support.

Our weather station implementation takes the following steps:

1. Obtain a proxy for the `TopicManager`. This is the primary IceStorm object, used by both publishers and subscribers.
2. Obtain a proxy for the `weather` topic by calling `createOrRetrieve("weather")` on the `TopicManager`.
3. Create an object adapter to host our `WeatherStation` servant.
4. Instantiate the servant and add the servant to the object adapter.
5. Activate the object adapter, so that it dispatches the events IceStorm delivers to the servant.
6. Activate the object adapter so that it can dispatch the events IceStorm delivers to the servant.
7. Subscribe to the `weather` topic by calling `subscribeAndGetPublisher` with a proxy for the `WeatherStation` object.
8. Unsubscribe from the `weather` topic by calling `unsubscribe` with the same proxy.

## Subscriber Identity

IceStorm identifies each subscription to a topic by the object identity of the subscriber proxy. When the topic already
has a subscription with this identity, `subscribeAndGetPublisher` throws `AlreadySubscribed` and keeps the existing
subscription, including its proxy and [quality of service](../../icestorm-quality-of-service) parameters. To replace the
stored proxy or the quality of service of a subscription, call `unsubscribe` and then subscribe again.

## See Also

- [Using IceStorm](..)
- [Oneway Invocations](../../../../runtime/invocation/invocation-mode/oneway-invocations)
