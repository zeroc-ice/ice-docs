{% language-section name="proxy-methods-for-batched-invocations" %}

```cpp
WeatherStationPrx batch = weatherStation.ice_batchOneway();
batch.report(sensorId, timeStamp1, reading1);
batch.report(sensorId, timeStamp2, reading2);
batch.ice_flushBatchRequests();
```

{% /language-section %}
