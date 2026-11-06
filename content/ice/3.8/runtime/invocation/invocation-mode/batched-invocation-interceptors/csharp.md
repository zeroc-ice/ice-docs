{% language-section name="mapping-2" %}

```csharp
const int maxBatchSize = 64 * 1024; // in bytes
initData.batchRequestInterceptor = (req, count, size) =>
{
    if (size + req.getSize() > maxBatchSize)
    {
        _ = FlushAsync(req.getProxy());
    }
    req.enqueue();
};

static async Task FlushAsync(Ice.ObjectPrx proxy)
{
    try
    {
        await proxy.ice_flushBatchRequestsAsync();
    }
    catch (Ice.LocalException exception)
    {
        Console.Error.WriteLine($"Failed to flush batch requests: {exception}");
    }
}
```

{% /language-section %}
