---
title: Oneway Invocations
sidebarLabel: Oneway
---

A oneway invocation is an invocation made with a oneway proxy, a proxy whose [invocation mode](..) is oneway. It sends
the request without waiting for a reply, and completes as soon as the client's local transport accepts the request. For
example, a client reports readings to a weather station:

{% iflang langs="cpp,java,js,matlab,php,python,ruby,swift" %}

```slice
struct AtmosphericConditions
{
    double temperature;
    double humidity;
    double pressure;
}

interface WeatherStation
{
    ["oneway"]
    void report(string sensorId, string timeStamp, AtmosphericConditions reading);
}
```

{% /iflang %}

{% iflang langs="csharp" %}

```slice
struct AtmosphericConditions
{
    double temperature;
    double humidity;
    double pressure;
}

interface WeatherStation
{
    ["oneway", "cs:identifier:Report"]
    void report(string sensorId, string timeStamp, AtmosphericConditions reading);
}
```

{% /iflang %}

The [oneway](../../../../slice/slice-metadata-directives#oneway) metadata directive is optional: it makes sure that
clients invoke `report` only with a oneway, datagram, or batch proxy.

`ice_oneway` returns a oneway proxy, and an invocation on this proxy is a oneway invocation:

{% language-section name="mapping" /%}

A oneway invocation reports the errors that occur before the local transport accepts the request, such as a failure to
establish a connection. It reports no error after this point, including when the connection fails or the dispatch fails.

The server dispatches a oneway request like any other request; `Current.requestId` is `0` for a oneway request.

If the server does not keep up with the client, the client's transport buffers fill up and a synchronous oneway
invocation blocks until there is room. An asynchronous oneway invocation does not block.

On the server side, Ice reads the oneway requests received on a connection in the order the client sent them. A thread
pool with several threads dispatches these requests concurrently, which loses this order. To dispatch the requests of a
connection one at a time, in order, see
[Serializing the Messages of Each Connection](../../../threading-model/thread-pools#serializing-the-messages-of-each-connection).
