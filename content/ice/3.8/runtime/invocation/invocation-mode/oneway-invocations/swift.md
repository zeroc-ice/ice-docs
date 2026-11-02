{% language-section name="mapping" %}

```swift
let oneway = weatherStation.ice_oneway()
try await oneway.report(sensorId: sensorId, timeStamp: timeStamp, reading: reading)
```

{% /language-section %}
