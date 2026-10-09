---
title: Implementing an IceStorm Publisher
---

An IceStorm publisher is an Ice client application that sends requests to a `Topic` hosted by the IceStorm service.

The `IceStorm/weather` demo program provides a complete publisher application. It’s available in all programming
languages.

The implementation of the weather sensor (or collector) can be summarized as follows:

1. Create a proxy for the IceStorm
   [TopicManager](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1TopicManager.html) . This is the primary
   IceStorm object, used by both publishers and subscribers.
2. Obtain a proxy for the `weather` [topic](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1Topic.html) by
   calling `createOrRetrieve("weather")` on the `TopicManager`. This operation returns a proxy to the topic with this
   name, creating this topic first if it does not exist.
3. Obtain a proxy for the `weather` topic's "publisher object" by calling `getPublisher` on the topic proxy. This proxy
   is provided for the purpose of publishing messages, and therefore is narrowed to the topic interface
   (`WeatherStation`).
4. Collect and report readings by invoking on the proxy created in the previous step.

## See Also

- [Configuring IceStorm](../../configuring-icestorm)
