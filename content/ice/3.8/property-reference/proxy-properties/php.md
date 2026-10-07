{% language-section name="mapping" %}

## _name_.CollocationOptimized

{% synopsis %}

`name.CollocationOptimized=num`

{% /synopsis %}

{% description %}

If `num` is a value greater than zero, the proxy is configured to use
[collocated invocations](../../runtime/collocated-invocation-and-dispatch) when possible, including calls to the
communicator's [Ice.Admin object adapter](../ice-admin-properties).

{% /description %}

{% /language-section %}
