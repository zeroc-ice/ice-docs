{% language-section name="lang-1" %}

## Ice.Warn.AMICallback

### Synopsis {% id="ice.warn.amicallback-synopsis" %}

`Ice.Warn.AMICallback=num`

### Description {% id="ice.warn.amicallback-description" %}

If `num` is set to a value larger than 0, the Ice runtime logs a warning when an AMI callback throws an exception. The
default value is 1.

{% /language-section %}

{% language-section name="lang-2" %}

## Ice.Warn.Executor

### Synopsis {% id="ice.warn.executor-synopsis" %}

`Ice.Warn.Executor=num`

### Description {% id="ice.warn.executor-description" %}

If `num` is set to a value larger than 0, the Ice runtime logs a warning when a custom executor (registered using
[InitializationData](https://code.zeroc.com/manual/Ice/InitializationData)) throws an exception while executing a call.

The default value is 1.

## Ice.Warn.SliceLoader

### Synopsis {% id="ice.warn.sliceloader-synopsis" %}

`Ice.Warn.SliceLoader=num`

### Description {% id="ice.warn.sliceloader-description" %}

When [Ice.SliceLoader.NotFoundCacheSize](../ice-properties) is set to a value larger than 0, the communicator installs a
“not found” cache to cache failed Slice loader resolutions. And when this cache is full, additional failed Slice loader
resolutions are not cached.

When `num` is set to a value larger than 0, the communicator logs a warning for the first failed resolution that is not
cached because the cache is full.

The default value is 1.

{% /language-section %}
