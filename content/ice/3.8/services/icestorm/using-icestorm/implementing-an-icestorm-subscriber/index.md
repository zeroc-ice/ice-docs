---
title: Implementing an IceStorm Subscriber
---

An IceStorm subscriber is an Ice server application that hosts a subscriber object, and registers a proxy to this object
with a [Topic](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1Topic.html) hosted by the IceStorm service.

The `IceStorm/weather` demo program provides a complete subscriber application. It’s available in all programming
languages with server-side support.

Our weather station implementation takes the following steps:

1. Obtain a proxy for the `TopicManager`. This is the primary IceStorm object, used by both publishers and subscribers.
2. Create an object adapter to host our `WeatherStation` servant.
3. Instantiate the servant and add the servant tot the object adapter.
4. Subscribe to the `weather` topic.
5. Process `report` messages until shutdown.
6. Unsubscribe from the `weather` topic.

## See Also

- [Using IceStorm](../using-icestorm)
- [Oneway Invocations](../oneway-invocations)
