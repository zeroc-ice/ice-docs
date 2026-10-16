{% language-section name="mapping" %}

```js
let weatherStation = new WeatherStationPrx(
    communicator,
    "ClearSky:tcp -p 4061 -h localhost");

// Configure the proxy to use the oneway invocation mode.
weatherStation = weatherStation.ice_oneway();

...

while (true) {
    await weatherStation.report(sensorId, timeStamp, getAtmosphericConditions());
    ...
}
```

{% /language-section %}
