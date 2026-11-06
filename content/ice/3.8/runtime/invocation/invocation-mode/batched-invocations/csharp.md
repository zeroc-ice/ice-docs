{% language-section name="proxy-methods-for-batched-invocations" %}

```csharp
WeatherStationPrx batch = WeatherStationPrxHelper.uncheckedCast(weatherStation.ice_batchOneway());
await batch.ReportAsync(sensorId, timeStamp1, reading1);
await batch.ReportAsync(sensorId, timeStamp2, reading2);
await batch.ice_flushBatchRequestsAsync();
```

{% /language-section %}
