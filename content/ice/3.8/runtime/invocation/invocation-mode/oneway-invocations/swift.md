{% language-section name="mapping" %}

```swift
var weatherStation = try makeProxy(
    communicator: communicator,
    proxyString: "ClearSky:tcp -p 4061 -h localhost",
    type: WeatherStationPrx.self)

// Configure the proxy to use the oneway invocation mode.
weatherStation = weatherStation.ice_oneway()

...

while true {
    try await weatherStation.report(
        sensorId: sensorId,
        timeStamp: timeStamp,
        reading: getAtmosphericConditions())
    ...
}
```

{% /language-section %}
