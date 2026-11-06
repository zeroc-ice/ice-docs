{% language-section name="mapping-2" %}

```py
maxBatchSize = 64 * 1024  # in bytes


async def logFlushFailure(flush: Awaitable[None]) -> None:
    try:
        await flush
    except Ice.LocalException as exception:
        print(f"Failed to flush batch requests: {exception}", file=sys.stderr)


def interceptor(request: Ice.BatchRequest, count: int, size: int) -> None:
    if size + request.getSize() > maxBatchSize:
        asyncio.create_task(logFlushFailure(request.getProxy().ice_flushBatchRequestsAsync()))
    request.enqueue()


initData.batchRequestInterceptor = interceptor
```

{% /language-section %}
