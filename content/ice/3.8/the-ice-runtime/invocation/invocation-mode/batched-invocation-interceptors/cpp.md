{% language-section name="lang-1" %}

```cpp
initData.batchRequestInterceptor =
    [](const Ice::BatchRequest& req, int count, int size)
    {
        req.enqueue();
    };
```

{% /language-section %}

{% language-section name="lang-2" %}

```cpp
int limit = initData.properties->getPropertyAsInt("Ice.BatchAutoFlushSize");
initData.batchRequestInterceptor =
    [limit](const Ice::BatchRequest& req, int count, int size)
    {
        if (size + req.getSize() > limit)
        {
            req.getProxy()->ice_flushBatchRequestsAsync();
        }
        req.enqueue();
    };
```

{% /language-section %}
