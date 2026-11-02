{% language-section name="proxy-methods-for-batched-invocations" %}

```js
const batch = weatherStation.ice_batchOneway();
await batch.report(sensorId, timeStamp1, reading1);
await batch.report(sensorId, timeStamp2, reading2);
await batch.ice_flushBatchRequests();
```

{% /language-section %}
