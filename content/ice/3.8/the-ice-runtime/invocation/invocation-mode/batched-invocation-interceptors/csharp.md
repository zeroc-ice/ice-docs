---
id: batched-invocation-interceptors
language: csharp
---

{% language-section name="lang-1" %}

```csharp
initData.batchRequestInterceptor = (req, _, _) => req.enqueue();
```

{% /language-section %}

{% language-section name="lang-2" %}

```csharp
int limit = initData.properties.getPropertyAsInt("Ice.BatchAutoFlushSize");
initData.batchRequestInterceptor = (req, _, size) =>
{
    if (size + req.getSize() > limit)
    {
        _ = req.getProxy().ice_flushBatchRequestsAsync();
    }
    req.enqueue();
};
```

{% /language-section %}
