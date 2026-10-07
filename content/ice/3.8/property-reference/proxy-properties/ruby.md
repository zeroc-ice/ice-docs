{% language-section name="mapping" %}

## _name_.CollocationOptimized

{% property-synopsis %}

`name.CollocationOptimized=num`

{% /property-synopsis %}

{% property-description %}

If `num` is a value greater than zero, the proxy is configured to use
[collocated invocations](../../runtime/collocated-invocation-and-dispatch) when possible, including calls to the
communicator's [Ice.Admin object adapter](../ice-admin-properties).

{% /property-description %}

{% /language-section %}
