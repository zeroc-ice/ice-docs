{% language-section name="proxy-methods-for-batched-invocations" %}

```swift
let batch = weatherStation.ice_batchOneway()
try await batch.report(sensorId: sensorId, timeStamp: timeStamp1, reading: reading1)
try await batch.report(sensorId: sensorId, timeStamp: timeStamp2, reading: reading2)
try await batch.ice_flushBatchRequests()
```

{% /language-section %}
