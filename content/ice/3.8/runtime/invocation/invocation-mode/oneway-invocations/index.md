---
title: Oneway Invocations
sidebarLabel: Oneway
---

A oneway invocation sends its request without waiting for a reply: it completes as soon as the client's local transport
accepts the request. For example, a client reports readings to a weather station:

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
    ["cs:identifier:Report"]
    void report(string sensorId, string timeStamp, AtmosphericConditions reading);
}
```

{% /iflang %}

{% language-section name="mapping" /%}

A oneway invocation reports the errors that occur before the local transport accepts the request, such as a failure to
establish a connection. It reports no error after this point, including when the connection fails or the dispatch fails.

The server dispatches a oneway request like any other request; `Current.requestId` is `0` for a oneway request.

If the server does not keep up with the client, the client's transport buffers fill up and a synchronous oneway
invocation blocks until there is room. An asynchronous oneway invocation does not block.

Oneway requests sent over one connection arrive in order, but the server's thread pool can dispatch them concurrently,
so a later request can execute before an earlier one. To dispatch them in order, use one of the techniques of
[Thread Pool Design Considerations](../../../threading-model/thread-pool-design-considerations).
