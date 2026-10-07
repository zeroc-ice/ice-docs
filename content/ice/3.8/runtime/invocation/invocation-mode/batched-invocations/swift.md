{% language-section name="proxy-methods-for-batched-invocations" %}

```swift
var weatherStation = try makeProxy(
    communicator: communicator,
    proxyString: "ClearSky:tcp -p 4061 -h localhost",
    type: WeatherStationPrx.self)

// Configure the proxy to use the batch oneway invocation mode.
weatherStation = weatherStation.ice_batchOneway()

...

while true {
    try await weatherStation.report(
        sensorId: sensorId,
        timeStamp: timeStamp,
        reading: getAtmosphericConditions())
    ...
    // Send a batch with the last 10 readings.
    count += 1
    if count == 10 {
        try await weatherStation.ice_flushBatchRequests()
        count = 0
    }
}
```

{% /language-section %}
