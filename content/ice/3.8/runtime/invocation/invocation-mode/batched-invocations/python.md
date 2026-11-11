{% language-section name="proxy-methods-for-batched-invocations" %}

```py
batch = weatherStation.ice_batchOneway()
await batch.reportAsync(sensorId, timeStamp1, reading1)
await batch.reportAsync(sensorId, timeStamp2, reading2)
await batch.ice_flushBatchRequestsAsync()
```

{% /language-section %}
