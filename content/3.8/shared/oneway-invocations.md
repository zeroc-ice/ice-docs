---
id: oneway-invocations
title: Oneway Invocations
---

Oneway invocations are sent on the client side by writing the request to the client’s local transport buffer. The invocation completes and returns control to the application as soon as the local transport accepts the request.

Oneway invocations are best suited for simple, stateless updates that do not rely on prior context or state. Because the client does not receive a reply, oneway calls are not guaranteed to succeed if the connection fails or the server is overloaded.

A typical example is reporting events:

```slice
interface WeatherStation
{
    void report(
        string sensorId,
        string timeStamp,
        AtmosphericConditions reading);
}
```

A client application can report a reading to a weather station like:

{% language-section name="lang-1" /%}

In this example, the client reports a reading and immediately continues with the next one, without waiting for the server to process the previous request.

Once a request is buffered locally, no further errors are reported to the client. Local errors, such as failing to establish a connection, are reported. Remote errors, such as the target object not existing or the connection failing after buffering, are not.

On the server side, oneway requests are received and processed like any other request, but the client’s invocation completes before the message even arrives. The server can identify a oneway request by examining `Current.requestId`: a non-zero value denotes a twoway request, whereas zero denotes a oneway request. Because the server never sends a reply, oneway calls can yield significant efficiency gains, especially when sending many small messages.

Using the oneway invocation mode requires two conditions: the operation must have a void return type, no out-parameters, and no exception specification—otherwise, the Ice runtime throws an exception. And the proxy must use a connection-oriented transport such as TCP or SSL; if not, the Ice runtime throws a NoEndpointException.

Although oneway invocations are not guaranteed to succeed, in practice they are reliable under normal conditions. Connection-oriented transports ensure ordered delivery, and flow control prevents overruns: if the server cannot keep up, the client eventually blocks until buffer space is available. Thus, oneway invocations normally return immediately, unless the client generates requests faster than the server can handle. If your application requires that oneway calls never block, you can use asynchronous oneway invocations instead.

Requests are delivered to the server in the order they were sent. However, the server’s thread pool may dispatch them in parallel, so a later request can be executed before an earlier one. If strict execution order is required, you can use one of the serialization techniques described in [Thread Pool Design Considerations](../thread-pool-design-considerations).

##### See Also

- [Terminology](../terminology)
- [Batched Invocations](../batched-invocations)
- [The Ice Threading Model](../the-ice-threading-model)
- [Datagram Invocations](../datagram-invocations)
