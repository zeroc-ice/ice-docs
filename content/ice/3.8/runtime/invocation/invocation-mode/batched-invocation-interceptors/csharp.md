{% language-section name="mapping-1" %}

```csharp
initData.batchRequestInterceptor = (req, _, _) => req.enqueue();
```

{% /language-section %}

{% language-section name="mapping-2" %}

```csharp
const int maxBatchSize = 64 * 1024; // in bytes
initData.batchRequestInterceptor = (req, count, size) =>
{
    if (size + req.getSize() > maxBatchSize)
    {
        _ = req.getProxy().ice_flushBatchRequestsAsync();
    }
    req.enqueue();
};
```

{% /language-section %}
