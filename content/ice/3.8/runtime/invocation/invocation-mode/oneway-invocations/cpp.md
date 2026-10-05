{% language-section name="mapping" %}

```cpp
WeatherStationPrx weatherStation(
    communicator,
    "ClearSky:tcp -p 4061 -h localhost");

// Configure the proxy to use the oneway invocation mode.
weatherStation = weatherStation.ice_oneway();

...

while (true) {
   weatherStation.report(sensorId, timeStamp, getAtmosphericConditions());
   ...
}
```

{% /language-section %}
