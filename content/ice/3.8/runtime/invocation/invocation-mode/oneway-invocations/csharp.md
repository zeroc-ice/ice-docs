{% language-section name="mapping" %}

```csharp
WeatherStationPrx oneway = WeatherStationPrxHelper.uncheckedCast(weatherStation.ice_oneway());
await oneway.ReportAsync(sensorId, timeStamp, reading);
```

{% /language-section %}
