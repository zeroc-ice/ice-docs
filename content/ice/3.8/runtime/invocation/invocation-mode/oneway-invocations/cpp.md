{% language-section name="mapping" %}

```cpp
WeatherStationPrx oneway = weatherStation.ice_oneway();
oneway.report(sensorId, timeStamp, reading);
```

{% /language-section %}
