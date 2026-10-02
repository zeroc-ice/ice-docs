{% language-section name="lang-1" %}

## Ice.Default.CollocationOptimized

### Synopsis {% id="ice.default.collocationoptimized-synopsis" %}

`Ice.Default.CollocationOptimized=num`

### Description {% id="ice.default.collocationoptimized-description" %}

Specifies whether proxy invocations use [collocation optimization](../../runtime/collocated-invocation-and-dispatch) by
default. When enabled, proxy invocations on a collocated servant (i.e., a servant whose object adapter was created by
the same communicator as the proxy) are made more efficiently by avoiding the network stack.

If not specified, the default value is 1. Set the property to 0 to disable collocation optimization by default.

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
