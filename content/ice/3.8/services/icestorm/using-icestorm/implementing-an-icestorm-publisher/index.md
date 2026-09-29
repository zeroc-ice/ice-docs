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
2. Obtain a proxy for the `weather` [topic](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceStorm_1_1Topic.html)
   from the `TopicManager`, either by creating the topic if it does not exist, or by retrieving the proxy for the
   existing topic.
3. Obtain a proxy for the `weather` topic's "publisher object" by calling `getPublisher` on the topic proxy. This proxy
   is provided for the purpose of publishing messages, and therefore is narrowed to the topic interface
   (`WeatherStation`).
4. Collect and report readings by invoking on the proxy created in the previous step.

## See Also

- [Configuring IceStorm](../configuring-icestorm)
