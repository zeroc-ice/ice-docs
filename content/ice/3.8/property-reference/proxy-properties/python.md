{% language-section name="mapping" %}

## _name_.CollocationOptimized

{% synopsis %}

`name.CollocationOptimized=num`

{% /synopsis %}

{% description %}

If `num` is a value greater than zero, the proxy is configured to use
[collocated invocations](../../runtime/collocated-invocation-and-dispatch) when possible. Defining this property is
equivalent to invoking the `ice_collocationOptimized` proxy method.

{% /description %}

{% /language-section %}
