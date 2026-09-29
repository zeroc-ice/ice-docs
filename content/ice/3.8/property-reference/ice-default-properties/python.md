{% language-section name="lang-1" %}

## Ice.Default.CollocationOptimized

### Synopsis

`Ice.Default.CollocationOptimized=num`

### Description

Specifies whether proxy invocations use [collocation optimization](../collocated-invocation-and-dispatch) by default.
When enabled, proxy invocations on a collocated servant (i.e., a servant whose object adapter was created by the same
communicator as the proxy) are made more efficiently by avoiding the network stack.

If not specified, the default value is 1. Set the property to 0 to disable collocation optimization by default.

{% /language-section %}

{% language-section name="lang-2" state="no-addition" /%}
