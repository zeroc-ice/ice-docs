{% language-section name="proxy-methods-for-batched-invocations" %}

```js
let weatherStation = new WeatherStationPrx(
    communicator,
    "ClearSky:tcp -p 4061 -h localhost");

// Configure the proxy to use the batch oneway invocation mode.
weatherStation = weatherStation.ice_batchOneway();

...

while (true) {
    await weatherStation.report(sensorId, timeStamp, getAtmosphericConditions());
    ...
    // Send a batch with the last 10 readings.
    if (++count == 10) {
        await weatherStation.ice_flushBatchRequests();
        count = 0;
    }
}
```

{% /language-section %}
