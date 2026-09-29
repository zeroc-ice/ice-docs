{% language-section name="lang-1" %}

```
WeatherStationPrx weatherStation(
    communicator,
    "ClearSky:tcp -p 4061 -h localhost");

// Configure the proxy to use the bath oneway invocation mode.
weatherStation = weatherStation.ice_batchOneway();

...

while (true) {
   weatherStation.report(sensorId, timeStamp, getAtmosphericConditions());
   ...
   // Send a batch with the last 10 readings.
   if (++count == 10) {
       weatherStation.ice_flushBatchRequests();
       count = 0;
   }
}
```

{% /language-section %}

{% language-section name="lang-2" %}

A client can track batch request activity, and even implement its own auto-flush logic, by installing a
[Batch Invocation Interceptor](../batched-invocation-interceptors).

{% /language-section %}
