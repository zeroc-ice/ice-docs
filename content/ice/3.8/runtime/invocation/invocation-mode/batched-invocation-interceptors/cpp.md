{% language-section name="mapping-1" %}

```cpp
initData.batchRequestInterceptor =
    [](const Ice::BatchRequest& req, int count, int size)
    {
        req.enqueue();
    };
```

{% /language-section %}

{% language-section name="mapping-2" %}

```cpp
constexpr int maxBatchSize = 64 * 1024; // in bytes
initData.batchRequestInterceptor =
    [](const Ice::BatchRequest& req, int count, int size)
    {
        if (size + req.getSize() > maxBatchSize)
        {
            req.getProxy()->ice_flushBatchRequestsAsync(
                [](std::exception_ptr ex)
                {
                    // Log the failure.
                });
        }
        req.enqueue();
    };
```

{% /language-section %}
