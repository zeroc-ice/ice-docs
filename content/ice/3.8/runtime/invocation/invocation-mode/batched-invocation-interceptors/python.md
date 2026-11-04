{% language-section name="mapping-2" %}

```py
maxBatchSize = 64 * 1024  # in bytes


def logFlushFailure(future: Ice.Future) -> None:
    if (exception := future.exception()) is not None:
        print(f"Failed to flush batch requests: {exception}", file=sys.stderr)


def interceptor(request: Ice.BatchRequest, count: int, size: int) -> None:
    if size + request.getSize() > maxBatchSize:
        request.getProxy().ice_flushBatchRequestsAsync().add_done_callback(logFlushFailure)
    request.enqueue()


initData.batchRequestInterceptor = interceptor
```

{% /language-section %}
