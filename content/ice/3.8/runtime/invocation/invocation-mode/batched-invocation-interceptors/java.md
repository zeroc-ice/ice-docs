{% language-section name="mapping-1" %}

```java
initData.batchRequestInterceptor = (req, count, size) -> req.enqueue();
```

{% /language-section %}

{% language-section name="mapping-2" %}

```java
final int maxBatchSize = 64 * 1024; // in bytes
initData.batchRequestInterceptor = (req, count, size) -> {
    if (size + req.getSize() > maxBatchSize) {
        req.getProxy().ice_flushBatchRequestsAsync();
    }
    req.enqueue();
};
```

{% /language-section %}
