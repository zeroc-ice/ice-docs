{% language-section name="lang-1" state="not-applicable" note="MATLAB returns asynchronous results through futures rather than application callbacks, so Ice.Warn.AMICallback does not apply to MATLAB application code." /%}

{% language-section name="lang-2" %}

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
