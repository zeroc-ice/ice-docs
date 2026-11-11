{% language-section name="mapping" %}

```java
WeatherStationPrx oneway = weatherStation.ice_oneway();
oneway.report(sensorId, timeStamp, reading);
```

{% /language-section %}
