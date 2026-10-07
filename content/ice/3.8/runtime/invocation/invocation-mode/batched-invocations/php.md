{% language-section name="proxy-methods-for-batched-invocations" %}

```php
$weatherStation = WeatherStationPrxHelper::createProxy(
    $communicator,
    'ClearSky:tcp -p 4061 -h localhost');

// Configure the proxy to use the batch oneway invocation mode.
$weatherStation = $weatherStation->ice_batchOneway();

...

while (true) {
    $weatherStation->report($sensorId, $timeStamp, getAtmosphericConditions());
    ...
    // Send a batch with the last 10 readings.
    if (++$count == 10) {
        $weatherStation->ice_flushBatchRequests();
        $count = 0;
    }
}
```

{% /language-section %}
