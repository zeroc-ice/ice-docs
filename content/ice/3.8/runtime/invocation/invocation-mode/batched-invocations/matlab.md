{% language-section name="proxy-methods-for-batched-invocations" %}

```matlab
weatherStation = WeatherStationPrx(communicator, 'ClearSky:tcp -p 4061 -h localhost');

% Configure the proxy to use the batch oneway invocation mode.
weatherStation = weatherStation.ice_batchOneway();

...

while true
    weatherStation.report(sensorId, timeStamp, getAtmosphericConditions());
    ...
    % Send a batch with the last 10 readings.
    count = count + 1;
    if count == 10
        weatherStation.ice_flushBatchRequests();
        count = 0;
    end
end
```

{% /language-section %}
