{% language-section name="mapping-1" %}

```py
initData.batchRequestInterceptor = lambda request, count, size: request.enqueue()
```

{% /language-section %}

{% language-section name="mapping-2" %}

```py
maxBatchSize = 64 * 1024  # in bytes


def interceptor(request: Ice.BatchRequest, count: int, size: int) -> None:
    if size + request.getSize() > maxBatchSize:
        request.getProxy().ice_flushBatchRequestsAsync()
    request.enqueue()


initData.batchRequestInterceptor = interceptor
```

{% /language-section %}
