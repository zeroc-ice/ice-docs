{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```py
def enqueue(self, request: Ice.BatchRequest, count: int, size: int):
    if size + req.getSize() > limit:
        _ = req.getProxy().ice_flushBatchRequestAsync()
    req.enqueue()

initData.batchRequestInterceptor = enqueue
```

{% /language-section %}
