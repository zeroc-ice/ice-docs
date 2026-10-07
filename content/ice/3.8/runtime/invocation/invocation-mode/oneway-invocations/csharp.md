{% language-section name="mapping" %}

```csharp
var weatherStation = WeatherStationPrxHelper.createProxy(
    communicator,
    "ClearSky:tcp -p 4061 -h localhost");

// Configure the proxy to use the oneway invocation mode.
weatherStation = WeatherStationPrxHelper.uncheckedCast(weatherStation.ice_oneway());

...

while (true)
{
    weatherStation.report(sensorId, timeStamp, getAtmosphericConditions());
    ...
}
```

{% /language-section %}
