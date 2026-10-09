{% language-section name="mapping" %}

## _name_.CollocationOptimized

{% property-synopsis %}

`name.CollocationOptimized=num`

{% /property-synopsis %}

{% property-description %}

If `num` is a value greater than `0`, the proxy is configured to use
[collocated invocations](../../runtime/collocated-invocation-and-dispatch) when possible. Defining this property is
equivalent to invoking the `ice_collocationOptimized` proxy method.

{% /property-description %}

{% /language-section %}
