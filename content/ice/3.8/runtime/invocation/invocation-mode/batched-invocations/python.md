{% language-section name="proxy-methods-for-batched-invocations" %}

```py
weatherStation = WeatherStationPrx(communicator, "ClearSky:tcp -p 4061 -h localhost")

# Configure the proxy to use the batch oneway invocation mode.
weatherStation = weatherStation.ice_batchOneway()

...

while True:
    weatherStation.report(sensorId, timeStamp, getAtmosphericConditions())
    ...
    # Send a batch with the last 10 readings.
    count += 1
    if count == 10:
        weatherStation.ice_flushBatchRequests()
        count = 0
```

{% /language-section %}

{% language-section name="automatically-flushing-batched-requests" %}

A client can track batch request activity, and flush batches before they reach `Ice.BatchAutoFlushSize`, by installing a
[Batch Invocation Interceptor](../batched-invocation-interceptors).

{% /language-section %}
